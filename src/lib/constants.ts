export const TEN_ADDRESSES = {
    SESSION_KEY_CREATE: '0x0000000000000000000000000000000000000003',
    SESSION_KEY_DELETE: '0x0000000000000000000000000000000000000004',
    SESSION_KEY_EXECUTE: '0x0000000000000000000000000000000000000005',
} as const;

export const TEN_CHAIN_ID = 8443;

export const DEFAULT_GAS_SETTINGS = {
    // Use percentiles for different network conditions
    PRIORITY_FEE_PERCENTILES: [25, 50, 75],
    // Number of blocks to look back for fee estimation
    FEE_HISTORY_BLOCKS: 10,
    // Base fee multipliers for different network conditions
    BASE_FEE_MULTIPLIERS: {
        LOW: 1.1, // Low priority
        MEDIUM: 1.2, // Medium priority (default)
        HIGH: 1.5, // High priority
    },
} as const;

export const LOCAL_STORAGE_KEY = 'TEN_SESSION_KEY';

export const DEFAULT_GATEWAY_URL = 'https://testnet.ten.xyz/';

export const DEFAULT_TEN_CONFIG = {
    id: 8443,
    name: 'TEN PROTOCOL',
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: {
            http: ['https://testnet-rpc.ten.xyz/v1/'],
        },
    },
    blockExplorers: {
        default: { name: 'Tenscan', url: 'https://testnet.tenscan.io' },
    },
};
