import { create } from 'zustand';

interface UIStore {
    // Modal states
    isConnectModalOpen: boolean;
    isSettingsModalOpen: boolean;
    isSessionKeyModalOpen: boolean;

    // Connect Modal actions
    openConnectModal: () => void;
    closeConnectModal: () => void;
    toggleConnectModal: () => void;
    setConnectModalOpen: (open: boolean) => void;

    // Settings Modal actions
    openSettingsModal: () => void;
    closeSettingsModal: () => void;
    toggleSettingsModal: () => void;
    setSettingsModalOpen: (open: boolean) => void;

    // Session Key Modal actions
    openSessionKeyModal: () => void;
    closeSessionKeyModal: () => void;
    toggleSessionKeyModal: () => void;
    setSessionKeyModalOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
    // Initial state
    isConnectModalOpen: false,
    isSettingsModalOpen: false,
    isSessionKeyModalOpen: false,

    // Connect Modal actions
    openConnectModal: () => set({ isConnectModalOpen: true }),
    closeConnectModal: () => set({ isConnectModalOpen: false }),
    toggleConnectModal: () => set((state) => ({ isConnectModalOpen: !state.isConnectModalOpen })),
    setConnectModalOpen: (open: boolean) => set({ isConnectModalOpen: open }),

    // Settings Modal actions
    openSettingsModal: () => set({ isSettingsModalOpen: true }),
    closeSettingsModal: () => set({ isSettingsModalOpen: false }),
    toggleSettingsModal: () => set((state) => ({ isSettingsModalOpen: !state.isSettingsModalOpen })),
    setSettingsModalOpen: (open: boolean) => set({ isSettingsModalOpen: open }),

    // Session Key Modal actions
    openSessionKeyModal: () => set({ isSessionKeyModalOpen: true }),
    closeSessionKeyModal: () => set({ isSessionKeyModalOpen: false }),
    toggleSessionKeyModal: () => set((state) => ({ isSessionKeyModalOpen: !state.isSessionKeyModalOpen })),
    setSessionKeyModalOpen: (open: boolean) => set({ isSessionKeyModalOpen: open }),
}));

