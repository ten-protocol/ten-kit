import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { encode as rlpEncode } from 'rlp';

import type {SessionKeyStore, TransactionParams, SessionBalanceObject} from '@/lib/types';
import { LOCAL_STORAGE_KEY, TEN_ADDRESSES } from '@/lib/constants';
import {
    parseEther,
    toHex,
    formatEther,
    hexToBytes,
} from '@/lib/encoding';
import {
    getLatestBlockNumber,
    toRlpHex,
    checkTenNetwork,
    calculateGasFees,
    setupProviderListeners,
} from '@/lib/helpers';

// Initial state
const initialState = {
    sessionKey: null,
    isActive: false,
    balance: null,
    isLoading: false,
    error: null,
};

const providerCleanupRef = { current: null as (() => void) | null };

export const useSessionKeyStore = create<SessionKeyStore>()(
    persist(
        (set, get) => ({
            ...initialState,

            provider: null,

            initSession: (provider) => {
                if (provider) {
                    console.log("Provider for session key set")
                    set({provider})
                }

                if (provider && get().sessionKey) {
                    get().updateBalance();
                }
            },

            updateState: (updates) => set((state) => ({ ...state, ...updates })),

            reset: () => set(initialState),

            createSessionKey: async () => {
                try {
                    let sessionKeyAddress = '';
                    set({ isLoading: true, error: null });

                    const provider = get().provider
                    if (!provider) {throw new Error('Cannot delete session. No provider is available.')}

                    set({provider})

                    // Setup provider listeners
                    setupProviderListeners(provider, (updates) => set(updates), providerCleanupRef);

                    // Check if connected to TEN network
                    await checkTenNetwork(provider);

                    console.log('🔑 Creating session key on TEN network...');
                    console.log('🔑 Using address:', TEN_ADDRESSES.SESSION_KEY_CREATE);

                    const existingKey = localStorage.getItem(LOCAL_STORAGE_KEY);
                    console.log('🔑 Existing key response:', existingKey);

                    if (existingKey && existingKey !== '0x') {
                        sessionKeyAddress = existingKey;
                    } else {
                        // Try to create a new session key
                        const response = await provider.request({
                            method: 'eth_getStorageAt',
                            params: [TEN_ADDRESSES.SESSION_KEY_CREATE, '0x0', 'latest'],
                        });

                        console.log('🔑 Create response:', response);
                        sessionKeyAddress = '0x' + response.slice(-40); // Extract address from response
                        console.log('🔑 Created new session key:', sessionKeyAddress);
                    }

                    set({
                        sessionKey: sessionKeyAddress,
                        isLoading: false,
                    });

                    // Update balance after creating session key
                    await get().updateBalance();

                    return sessionKeyAddress;
                } catch (error) {
                    console.error('🔑 Session key creation error:', error);
                    const err = error instanceof Error ? error : new Error('Unknown error');
                    set({ error: err, isLoading: false });
                    throw err;
                }
            },

            fundSessionKey: async (amount: string, userAddress: string) => {
                try {
                    set({ isLoading: true, error: null });
                    const sessionKeyAddress = get().sessionKey
                    const provider = get().provider

                    if (!sessionKeyAddress) {throw new Error('Cannot fund session. No session key is available.')}
                    if (!provider) {throw new Error('Cannot fund session. Provider is not available.')}

                    // Check if connected to TEN network
                    await checkTenNetwork(provider);

                    // Convert amount to hex
                    const valueInWei = parseEther(amount);
                    const valueHex = toHex(valueInWei) as `0x${string}`;

                    // Send transaction
                    const txHash = await provider.request({
                        method: 'eth_sendTransaction',
                        params: [
                            {
                                to: sessionKeyAddress,
                                value: valueHex,
                                from: userAddress,
                            },
                        ],
                    });


                    // Monitor transaction confirmation
                    const checkTx = async (): Promise<any> => {
                        const receipt = await provider.request({
                            method: 'eth_getTransactionReceipt',
                            params: [txHash],
                        });
                        if (receipt) {
                            console.log('Funding confirmed!');
                            return receipt;
                        }
                        // Check again in 2 seconds
                        await new Promise((resolve) => setTimeout(resolve, 2000));
                        return checkTx();
                    };

                    await checkTx();
                    set({ isLoading: false });
                    return txHash;
                } catch (error) {
                    const err = error instanceof Error ? error : new Error('Unknown error');
                    set({ error: err, isLoading: false });
                    throw err;
                }
            },

            deleteSessionKey: async () => {
                try {
                    set({ isLoading: true, error: null });
                    const sessionKeyAddress = get().sessionKey;
                    const provider = get().provider

                    if (!sessionKeyAddress) {throw new Error('Cannot delete session. No session key is available')}
                    if (!provider) {throw new Error('Cannot delete session. No provider is available.')}

                    // Check if connected to TEN network
                    await checkTenNetwork(provider);

                    await provider.request({
                        method: 'eth_getStorageAt',
                        params: [
                            TEN_ADDRESSES.SESSION_KEY_DELETE,
                            JSON.stringify({ sessionKeyAddress }),
                            'latest',
                        ],
                    });

                    // Remove provider listeners
                    if (providerCleanupRef.current) {
                        providerCleanupRef.current();
                        providerCleanupRef.current = null;
                    }

                    set({
                        sessionKey: null,
                        isActive: false,
                        balance: null,
                        isLoading: false,
                    });
                } catch (error) {
                    const err = error instanceof Error ? error : new Error('Deletion failed');
                    set({ error: err, isLoading: false });
                    throw err;
                }
            },

            cleanupSessionKey: async () => {
                try {
                    set({ isLoading: true, error: null });

                    const provider = get().provider
                    if (!provider) {throw new Error('Cannot delete session. No provider is available.')}

                    // Check if connected to TEN network
                    await checkTenNetwork(provider);

                    // Then delete
                    await provider.request({
                        method: 'eth_getStorageAt',
                        params: [TEN_ADDRESSES.SESSION_KEY_DELETE, '0x0', 'latest'],
                    });

                    set({
                        sessionKey: null,
                        isActive: false,
                        balance: null,
                        isLoading: false,
                    });
                } catch (error) {
                    const err = error instanceof Error ? error : new Error('Cleanup failed');
                    set({ error: err, isLoading: false });
                    throw err;
                }
            },

            updateBalance: async () => {
                try {
                    const provider = get().provider
                    const sessionKeyAddress = get().sessionKey
                    if (!sessionKeyAddress) {throw new Error('Cannot delete session. No session key is available.')}
                    if (!provider) {throw new Error('Cannot delete session. No provider is available.')}

                    const balanceHex = await provider.request({
                        method: 'eth_getBalance',
                        params: [sessionKeyAddress, 'pending'],
                    });

                    const balanceWei = BigInt(balanceHex);
                    const ethBalance = formatEther(balanceWei);

                    console.log('ETH balance:', balanceWei);
                    const balance: SessionBalanceObject = {
                        eth: parseFloat(ethBalance),
                        estimatedTransactions: 0,
                    }

                    set({balance});

                    return balance
                } catch (error) {
                    console.warn('Failed to update balance:', error);
                    return null
                }
            },

            sendTransaction: async (txParams: TransactionParams) => {
                try {
                    set({ isLoading: true, error: null });

                    const provider = get().provider
                    if (!provider) {throw new Error('Cannot delete session. No provider is available.')}

                    // Check if connected to TEN network
                    await checkTenNetwork(provider);

                    const sessionKeyAddress = get().sessionKey;
                    if (!sessionKeyAddress) {
                        throw new Error(
                            'No active session key. Create and activate a session key first.'
                        );
                    }

                    // 1. Get chain ID
                    const chainId = await provider.request({ method: 'eth_chainId' });
                    const chainIdInt = parseInt(chainId, 16);

                    // 2. Get nonce
                    let nonce: number;
                    if (txParams.nonce !== undefined) {
                        nonce = txParams.nonce;
                    } else {
                        // Get the latest block number via direct RPC to ensure fresh data (bypasses all caching)
                        let latestBlockHex = await getLatestBlockNumber();

                        // If direct RPC fails, fallback to provider
                        if (!latestBlockHex) {
                            latestBlockHex = await provider.request({
                                method: 'eth_blockNumber',
                                params: [],
                            });
                        }

                        const nonceHex = await provider.request({
                            method: 'eth_getTransactionCount',
                            params: [sessionKeyAddress, latestBlockHex],
                        });
                        nonce = parseInt(nonceHex, 16);
                    }

                    // 3. Calculate gas fees
                    let maxFeePerGas: bigint;
                    let maxPriorityFeePerGas: bigint;


                    if (txParams.maxFeePerGas && txParams.maxPriorityFeePerGas) {
                        maxFeePerGas = BigInt(txParams.maxFeePerGas);
                        maxPriorityFeePerGas = BigInt(txParams.maxPriorityFeePerGas);
                    } else {
                        // Use dynamic fee calculation
                        const gasFees = await calculateGasFees(provider, 'MEDIUM');
                        maxFeePerGas = gasFees.maxFeePerGas;
                        maxPriorityFeePerGas = gasFees.maxPriorityFeePerGas;
                    }

                    // 4. Get gas limit (use provided or estimate)
                    let gasLimit: number;
                    if (txParams.gasLimit) {
                        gasLimit = txParams.gasLimit;
                    } else {
                        const gasEstimate = await provider.request({
                            method: 'eth_estimateGas',
                            params: [
                                {
                                    to: txParams.to,
                                    data: txParams.data,
                                    value: txParams.value || '0x0',
                                    from: sessionKeyAddress,
                                },
                            ],
                        });
                        gasLimit = parseInt(gasEstimate, 16);
                    }

                    // 5. Build EIP-1559 transaction array
                    const txArray = [
                        toHex(chainIdInt), // chainId
                        nonce === 0 ? '0x' : toHex(nonce), // nonce (special case for 0)
                        toRlpHex(maxPriorityFeePerGas), // maxPriorityFeePerGas
                        toRlpHex(maxFeePerGas), // maxFeePerGas
                        toRlpHex(gasLimit), // gasLimit
                        txParams.to.toLowerCase(), // to (ensure lowercase)
                        txParams.value ? txParams.value.toLowerCase() : '', // value (empty string for zero in RLP)
                        txParams.data?.toLowerCase() || '', // data (empty string for empty data in RLP)
                        [], // accessList (empty for now)
                        '', // v (signature placeholder - empty for RLP)
                        '', // r (signature placeholder - empty for RLP)
                        '', // s (signature placeholder - empty for RLP)
                    ].map((value) => {
                        // For RLP encoding: empty strings stay empty, non-empty hex strings get 0x prefix
                        if (typeof value === 'string' && value !== '' && !value.startsWith('0x')) {
                            return '0x' + value;
                        }
                        return value;
                    });

                    // 6. RLP encode the transaction
                    const rlpEncoded = rlpEncode(txArray);

                    // 7. Prepare EIP-1559 transaction (type 2)
                    // Convert RLP result to hex string - handle any type
                    let rlpHex: string;

                    // The RLP library returns a Buffer or Uint8Array
                    if (rlpEncoded && typeof rlpEncoded === 'object' && 'length' in rlpEncoded) {
                        // It's array-like (Buffer or Uint8Array)
                        const bytes = Array.from(rlpEncoded as Uint8Array);
                        rlpHex = bytes
                            .map((byte: number) => byte.toString(16).padStart(2, '0'))
                            .join('');
                    } else {
                        // Fallback - shouldn't happen with RLP but just in case
                        throw new Error('Unexpected RLP encoding result');
                    }

                    const rlpBytes = hexToBytes('0x' + rlpHex);
                    const txBytes = new Uint8Array([
                        2, // EIP-1559 transaction type
                        ...Array.from(rlpBytes), // RLP encoded transaction
                    ]);

                    // 8. Convert to base64 for TEN
                    const txBase64 = btoa(String.fromCharCode(...Array.from(txBytes)));

                    // 9. Send through TEN session key execution
                    const txHash = await provider.request({
                        method: 'eth_getStorageAt',
                        params: [
                            TEN_ADDRESSES.SESSION_KEY_EXECUTE,
                            JSON.stringify({
                                sessionKeyAddress: sessionKeyAddress,
                                tx: txBase64,
                            }),
                            'latest',
                        ],
                    });

                    set({ isLoading: false });
                    return txHash;
                } catch (error) {
                    const err = error instanceof Error ? error : new Error('Transaction failed');
                    set({ error: err, isLoading: false });
                    throw err;
                }
            },

        }),
        {
            name: 'ten-session-key-state',
            partialize: (state) => ({
                sessionKey: state.sessionKey
            }),
        }
    )
);
