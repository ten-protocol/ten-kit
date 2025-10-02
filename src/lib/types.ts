export interface SessionKeyState {
    sessionKey: string | null;
    isActive: boolean;
    balance: {
        eth: number;
        estimatedTransactions: number;
    } | null;
    isLoading: boolean;
    error: Error | null;
}

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
    balance: SessionKeyState['balance'];
    isLoading: boolean;
    error: Error | null;

    // Actions
    setSessionKey: (sessionKey: string | null) => void;
    setIsActive: (isActive: boolean) => void;
    setBalance: (balance: SessionKeyState['balance']) => void;
    setIsLoading: (isLoading: boolean) => void;
    setError: (error: Error | null) => void;
    updateState: (updates: Partial<SessionKeyState>) => void;
    reset: () => void;

    // Session key operations
    createSessionKey: (provider: EIP1193Provider) => Promise<string>;
    fundSessionKey: (
        sessionKeyAddress: string,
        amount: string,
        provider: EIP1193Provider,
        userAddress: string
    ) => Promise<string>;
    deleteSessionKey: (provider: EIP1193Provider) => Promise<void>;
    cleanupSessionKey: (provider: EIP1193Provider) => Promise<void>;
    updateBalance: (sessionKeyAddress: string, provider: EIP1193Provider) => Promise<void>;

    // Transaction operations
    sendTransaction: (txParams: TransactionParams, provider: EIP1193Provider) => Promise<string>;
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
