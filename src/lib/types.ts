import {Config} from "wagmi";

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

export interface TransactionReceipt {
    transactionHash: string;
    transactionIndex: string;
    blockHash: string;
    blockNumber: string;
    from: string;
    to: string | null;
    cumulativeGasUsed: string;
    gasUsed: string;
    contractAddress: string | null;
    logs: Array<{
        address: string;
        topics: string[];
        data: string;
        blockNumber: string;
        transactionHash: string;
        transactionIndex: string;
        blockHash: string;
        logIndex: string;
        removed: boolean;
    }>;
    logsBloom: string;
    status: string; // '0x1' for success, '0x0' for failure
    effectiveGasPrice: string;
    type: string;
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
    wagmiConfig: null|Config

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
    waitForReceipt: (txHash: string, timeout?: number) => Promise<TransactionReceipt>;
    setWagmiConfig: (config: Config) => void;
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
