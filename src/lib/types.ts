export interface SessionKeyState {
    sessionKey: string | null;
    isActive: boolean;
    balance: SessionBalanceObject;
    isLoading: boolean;
    error: Error | null;
}

export type SessionBalanceObject = {
    eth: number;
    estimatedTransactions: number;
} | null;

export interface EIP1193Provider {
    request(args: { method: string; params?: any[] }): Promise<any>;
    on?: (event: string, callback: () => void) => void;
    removeListener?: (event: string, callback: () => void) => void;
}

export interface TransactionParams {
    to: string;
    data?: string;
    value?: string;
    nonce?: number;
    gasLimit?: number;
    maxFeePerGas?: string | bigint;
    maxPriorityFeePerGas?: string | bigint;
}

export type StateSubscriber = (state: SessionKeyState) => void;

export interface SessionKeyStore {
    // State
    sessionKey: string | null;
    isActive: boolean;
    balance: SessionBalanceObject;
    isLoading: boolean;
    error: Error | null;
    provider: EIP1193Provider | null,

    // Actions
    initSession: (provider: EIP1193Provider) => void;
    updateState: (updates: Partial<SessionKeyState>) => void;
    reset: () => void;
    createSessionKey: () => Promise<string>;
    fundSessionKey: (amount: string,userAddress: string) => Promise<string>;
    deleteSessionKey: () => Promise<void>;
    cleanupSessionKey: () => Promise<void>;
    updateBalance: () => Promise<SessionBalanceObject>;
    sendTransaction: (txParams: TransactionParams) => Promise<string>;
}

export interface TenConfig {
    id: number;
    name: string;
    nativeCurrency: {
        decimals: number;
        name: string;
        symbol: string;
    };
    rpcUrls: {
        default: {
            http: string[];
        };
    };
    blockExplorers: {
        default: { 
            name: string; 
            url: string; 
        };
    };
}

export interface ConnectWalletWrapperProps {
    children: React.ReactNode;
    className?: string;
    errorState?: boolean;
    loading: boolean;
    gatewayUrl?: string;
}

export interface ConnectWalletButtonProps {
    className?: string;
    onChainChange?: (chainId: number, isCorrect: boolean) => void;
    gatewayUrl?: string;
}
