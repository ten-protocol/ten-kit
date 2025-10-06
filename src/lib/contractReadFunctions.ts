import { createPublicClient, defineChain, http, webSocket, type PublicClient, type Transport, type Chain } from 'viem';
import {DEFAULT_TEN_CONFIG} from "@/lib/constants";

const TEN_PUBLIC_TOKEN_KEY = 'TEN_PUBLIC_TOKEN';
const TEN_PUBLIC_TOKEN_TIMESTAMP_KEY = 'TEN_PUBLIC_TOKEN_TIMESTAMP';
const TOKEN_MAX_AGE_MS = 24 * 60 * 60 * 1000;

interface StoredToken {
    token: string;
    timestamp: number;
}

export interface TENPublicClients {
    httpsClient: PublicClient<Transport, Chain>;
    websocketClient: PublicClient<Transport, Chain>;
}

const getStoredToken = (): StoredToken | null => {
    if (typeof window === 'undefined') return null;
    
    const token = localStorage.getItem(TEN_PUBLIC_TOKEN_KEY);
    const timestamp = localStorage.getItem(TEN_PUBLIC_TOKEN_TIMESTAMP_KEY);
    
    if (!token || !timestamp) return null;
    
    return {
        token,
        timestamp: parseInt(timestamp, 10)
    };
};

const storeToken = (token: string): void => {
    if (typeof window === 'undefined') return;
    
    const timestamp = Date.now();
    localStorage.setItem(TEN_PUBLIC_TOKEN_KEY, token);
    localStorage.setItem(TEN_PUBLIC_TOKEN_TIMESTAMP_KEY, timestamp.toString());
};

const clearStoredToken = (): void => {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(TEN_PUBLIC_TOKEN_KEY);
    localStorage.removeItem(TEN_PUBLIC_TOKEN_TIMESTAMP_KEY);
};

const isTokenExpired = (timestamp: number): boolean => {
    const age = Date.now() - timestamp;
    return age > TOKEN_MAX_AGE_MS;
};

const revokeToken = async (token: string): Promise<void> => {
    const revokeEndpoint = `https://testnet-rpc.ten.xyz/v1/revoke/?token=${token}`;
    
    try {
        await fetch(revokeEndpoint);
        console.log('Token revoked successfully');
    } catch (error) {
        console.error('Failed to revoke token:', error);
    }
};

const fetchNewToken = async (retries = 3, delayMs = 1000): Promise<string> => {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch('https://testnet-rpc.ten.xyz/v1/join/');
            
            if (!response.ok) {
                throw new Error(`Failed to fetch token: ${response.status} ${response.statusText}`);
            }
            
            const token = await response.text();
            
            if (!token || token.trim() === '') {
                throw new Error('Received empty token from server');
            }
            
            console.log(`Successfully fetched new token (attempt ${attempt}/${retries})`);
            return token;
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            console.error(`Failed to fetch token (attempt ${attempt}/${retries}):`, lastError.message);
            
            if (attempt < retries) {
                await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
            }
        }
    }
    
    throw new Error(`Failed to fetch token after ${retries} attempts: ${lastError?.message || 'Unknown error'}`);
};

const getOrRefreshToken = async (): Promise<string> => {
    const stored = getStoredToken();
    
    if (!stored) {
        try {
            const newToken = await fetchNewToken();
            storeToken(newToken);
            return newToken;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error('Critical: Unable to fetch initial token:', errorMessage);
            throw new Error(`Unable to initialize TEN network connection: ${errorMessage}`);
        }
    }
    
    if (isTokenExpired(stored.timestamp)) {
        console.log('Token expired, fetching new token...');
        
        try {
            const newToken = await fetchNewToken();
            
            try {
                await revokeToken(stored.token);
            } catch (error) {
                console.warn('Failed to revoke old token, but new token is available:', error);
            }
            
            clearStoredToken();
            storeToken(newToken);
            return newToken;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error('Failed to fetch new token, falling back to expired token:', errorMessage);
            console.warn('WARNING: Using expired token as fallback. Some operations may fail.');
            return stored.token;
        }
    }
    
    return stored.token;
};

export const CreatePublicClients = async (): Promise<TENPublicClients> => {
    const token = await getOrRefreshToken();
    const rpc_url = `https://testnet-rpc.ten.xyz/v1/?token=${token}`;
    const ws_rpc_url = `wss://testnet-rpc.ten.xyz:443/v1/?token=${token}`;

    const tenChain = defineChain({
        ...DEFAULT_TEN_CONFIG,
        rpcUrls: {
            default: {
                http: [rpc_url ?? ''],
                webSocket: [ws_rpc_url ?? ''],
            },
        },
    });

    return {
        httpsClient: createPublicClient({
            chain: tenChain,
            transport: http(process.env.NEXT_PUBLIC_TEN_RPC_URL),
        }),
        websocketClient: createPublicClient({
            chain: tenChain,
            transport: webSocket(process.env.NEXT_PUBLIC_TEN_WS_URL),
        })
    }
}