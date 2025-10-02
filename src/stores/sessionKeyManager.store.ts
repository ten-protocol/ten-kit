import { create } from 'zustand';
import { formatEther } from 'viem';
import { useSessionKeyStore } from './sessionKey.store';

export enum DeletionState {
    IDLE = 'idle',
    ACTIVE = 'active',
    WITHDRAWING = 'withdrawing',
    DELETING = 'deleting',
    COMPLETED = 'completed',
    ERROR = 'error',
}

export type SessionKeyManagerStore = {
    isRefreshingBalance: boolean;
    balance: number;
    deletionState: DeletionState;
    deletionError: string | null;
    isTransacting: boolean;

    // Actions
    startSession: (provider: any, isConnected: boolean) => Promise<void>;
    fundSession: (
        fundAmount: string,
        provider: any,
        address: string,
        isConnected: boolean
    ) => Promise<void>;
    withdrawAmountAction: (
        withdrawAmount: string,
        provider: any,
        address: string,
        isConnected: boolean
    ) => Promise<void>;
    confirmDeleteSession: (provider: any, address: string, isConnected: boolean) => Promise<void>;
    updateSessionKeyBalance: (provider: any) => Promise<void>;
    withdrawFromSessionKey: (
        provider: any,
        recipientAddress: string,
        amount?: string
    ) => Promise<boolean>;
    clearLocalStorage: () => void;
    resetDeletionState: () => void;
    setTransacting: (isTransacting: boolean) => void;
};

export const useSessionKeyManagerStore = create<SessionKeyManagerStore>()((set, get) => ({
    isRefreshingBalance: false,
    balance: 0,
    deletionState: DeletionState.IDLE,
    deletionError: null,
    isTransacting: false,

    // Session key actions
    startSession: async (provider, isConnected) => {
        const { createSessionKey, sessionKey, updateState } = useSessionKeyStore.getState();

        if (!provider || !isConnected) {
            alert('Please connect your wallet first');
            return;
        }

        try {
            await createSessionKey(provider);

            // Update balance after creation and activation
            setTimeout(() => {
                if (sessionKey) {
                    get().updateSessionKeyBalance(provider);
                }
            }, 2000);
        } catch (error) {
            console.error('Failed to start session:', error);
            updateState({
                error: new Error(
                    error instanceof Error ? error.message : 'Failed to start session'
                ),
                isLoading: false,
            });
        }
    },

    fundSession: async (fundAmount, provider, address, isConnected) => {
        const { fundSessionKey, sessionKey, updateState } = useSessionKeyStore.getState();

        if (!provider || !isConnected || !address) {
            alert('Please connect your wallet first');
            return;
        }

        if (!sessionKey) {
            alert('Please start a session first');
            return;
        }

        if (!fundAmount || parseFloat(fundAmount) <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        set({ isTransacting: true });
        try {
            await fundSessionKey(
                fundAmount,
                provider,
                address as `0x${string}`
            );

            // Update balance after funding and reactivation
            setTimeout(() => {
                if (sessionKey) {
                    get().updateSessionKeyBalance(provider);
                }
            }, 1000);
        } catch (error) {
            console.error('Failed to fund session:', error);
            updateState({
                error: new Error(error instanceof Error ? error.message : 'Failed to fund session'),
                isLoading: false,
            });
        } finally {
            set({ isTransacting: false });
        }
    },

    withdrawAmountAction: async (withdrawAmount, provider, address, isConnected) => {
        const { sessionKey, updateState } = useSessionKeyStore.getState();

        if (!provider || !isConnected || !address) {
            alert('Please connect your wallet first');
            return;
        }

        if (!sessionKey) {
            alert('Please start a session first');
            return;
        }

        if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        set({ isTransacting: true });
        try {
            await get().withdrawFromSessionKey(provider, address, withdrawAmount);

            setTimeout(() => {
                if (sessionKey) {
                    get().updateSessionKeyBalance(provider);
                }
            }, 2000);
        } catch (error) {
            console.error('Failed to withdraw amount:', error);
            updateState({
                error: new Error(
                    error instanceof Error ? error.message : 'Failed to withdraw amount'
                ),
                isLoading: false,
            });
        } finally {
            set({ isTransacting: false });
        }
    },

    confirmDeleteSession: async (provider, address, isConnected) => {
        const { deleteSessionKey, updateState } = useSessionKeyStore.getState();

        if (!provider || !isConnected || !address) return;

        try {
            // Set state to active
            set({ deletionState: DeletionState.ACTIVE });

            console.log('🔄 Attempting to withdraw funds before closing session...');
            // Set state to withdrawing
            set({ deletionState: DeletionState.WITHDRAWING });

            const withdrawalSuccess = await get().withdrawFromSessionKey(provider, address);

            if (!withdrawalSuccess) {
                set({ deletionState: DeletionState.ERROR });
                updateState({
                    error: new Error(
                        'Failed to withdraw funds from session key. Please try again or use troubleshooting options.'
                    ),
                    isLoading: false,
                });
                return;
            }

            console.log('✅ Funds withdrawn successfully, proceeding with session closure...');
            // Set state to deleting
            set({ deletionState: DeletionState.DELETING });

            await deleteSessionKey(provider);
            console.log('Session key deleted successfully');

            // Set state to completed
            set({ deletionState: DeletionState.COMPLETED });
        } catch (error) {
            console.error('Failed to delete session:', error);
            set({ deletionState: DeletionState.ERROR });
        }
    },

    updateSessionKeyBalance: async ( provider) => {
        const { updateBalance, sessionKey, balance } = useSessionKeyStore.getState();
        if (!sessionKey || get().isRefreshingBalance) return;
        set({ isRefreshingBalance: true });

        try {
            const balance = await updateBalance(provider);

            set({ balance: balance?.eth || 0 });
        } catch (error) {
            console.warn('Failed to update balance:', error);
        } finally {
            set({ isRefreshingBalance: false });
        }
    },

    withdrawFromSessionKey: async (provider, recipientAddress, amount) => {
        const { sendTransaction, sessionKey } = useSessionKeyStore.getState();

        try {
            if (!sessionKey) {
                throw new Error('No session key available');
            }

            const balanceHex = await provider.request({
                method: 'eth_getBalance',
                params: [sessionKey, 'pending'],
            });
            const balanceWei = BigInt(balanceHex);
            const fixedGasReserve = BigInt('200000000000000'); // 0.0002 ETH fixed reserve

            let amountToSend: bigint;

            if (amount) {
                const requestedAmountWei = BigInt(Math.floor(parseFloat(amount) * 1e18));
                const totalNeeded = requestedAmountWei + fixedGasReserve;

                if (balanceWei < totalNeeded) {
                    throw new Error(
                        `Insufficient balance. Available: ${formatEther(balanceWei)} ETH, Required: ${formatEther(totalNeeded)} ETH (includes ${formatEther(fixedGasReserve)} ETH for gas)`
                    );
                }

                amountToSend = requestedAmountWei;
            } else {
                if (balanceWei <= fixedGasReserve) {
                    console.log(
                        'Session key balance too low to cover gas costs, skipping withdrawal'
                    );
                    return true;
                }

                amountToSend = balanceWei - fixedGasReserve;
            }

            const valueHex = `0x${amountToSend.toString(16)}`;

            const txHash = await sendTransaction(
                {
                    to: recipientAddress,
                    value: valueHex,
                },
                provider
            );

            console.log('Withdrawal transaction submitted:', txHash);
            console.log('Waiting for transaction confirmation...');

            // Wait for transaction confirmation
            const waitForConfirmation = async () => {
                for (let i = 0; i < 30; i++) {
                    try {
                        const receipt = await provider.request({
                            method: 'eth_getTransactionReceipt',
                            params: [txHash],
                        });

                        if (receipt) {
                            if (receipt.status === '0x1') {
                                console.log('Withdrawal transaction confirmed successfully');
                                return true;
                            } else {
                                console.error('Withdrawal transaction failed');
                                return false;
                            }
                        }
                    } catch (error) {
                        console.warn('Error checking transaction status:', error);
                    }

                    await new Promise((resolve) => setTimeout(resolve, 2000));
                }

                console.error('Withdrawal transaction confirmation timeout');
                return false;
            };

            const confirmed = await waitForConfirmation();
            if (!confirmed) {
                throw new Error('Withdrawal transaction failed or timed out');
            }

            console.log('Withdrawal completed successfully');
            return true;
        } catch (error) {
            console.error('Withdrawal failed with error:', error);
            throw error;
        }
    },

    clearLocalStorage: () => {
        try {
            localStorage.removeItem('ten-session-key-state');
            console.log('Session key state cleared from localStorage');
            window.location.reload();
        } catch (error) {
            console.error('Failed to clear localStorage:', error);
        }
    },

    resetDeletionState: () => {
        set({ deletionState: DeletionState.IDLE });
    },

    setTransacting: (isTransacting: boolean) => {
        set({ isTransacting });
    },
}));
