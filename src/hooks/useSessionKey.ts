import { useSessionKeyStore } from '../stores/sessionKey.store';

export const useSessionKey = () => {
    const store = useSessionKeyStore();
    return {
        // State
        sessionKey: store.sessionKey,
        isActive: store.isActive,
        balance: store.balance,
        isLoading: store.isLoading,
        error: store.error,

        // Actions
        createSessionKey: store.createSessionKey,
        fundSessionKey: store.fundSessionKey,
        deleteSessionKey: store.deleteSessionKey,
        cleanupSessionKey: store.cleanupSessionKey,
        updateBalance: store.updateBalance,
        sendTransaction: store.sendTransaction,
        reset: store.reset,
    };
};
