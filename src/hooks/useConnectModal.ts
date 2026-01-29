import { useUIStore } from '@/stores/ui.store';

/**
 * Hook to control the Connect, Settings, and Session Key modals.
 * Use this to create custom buttons or trigger modals from anywhere in your app.
 * 
 * @example
 * ```tsx
 * const { openConnectModal, openSettingsModal, openSessionKeyModal } = useConnectModal();
 * 
 * return (
 *   <>
 *     <button onClick={openConnectModal}>Connect Wallet</button>
 *     <button onClick={openSessionKeyModal}>Manage Session Key</button>
 *   </>
 * );
 * ```
 */
export function useConnectModal() {
    const {
        isConnectModalOpen,
        isSettingsModalOpen,
        isSessionKeyModalOpen,
        openConnectModal,
        closeConnectModal,
        toggleConnectModal,
        setConnectModalOpen,
        openSettingsModal,
        closeSettingsModal,
        toggleSettingsModal,
        setSettingsModalOpen,
        openSessionKeyModal,
        closeSessionKeyModal,
        toggleSessionKeyModal,
        setSessionKeyModalOpen,
    } = useUIStore();

    return {
        // State
        isConnectModalOpen,
        isSettingsModalOpen,
        isSessionKeyModalOpen,

        // Connect Modal
        openConnectModal,
        closeConnectModal,
        toggleConnectModal,
        setConnectModalOpen,

        // Settings Modal
        openSettingsModal,
        closeSettingsModal,
        toggleSettingsModal,
        setSettingsModalOpen,

        // Session Key Modal
        openSessionKeyModal,
        closeSessionKeyModal,
        toggleSessionKeyModal,
        setSessionKeyModalOpen,
    };
}

