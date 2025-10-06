// Import styles
import './styles/globals.css';

// Main Provider
export { TENProvider } from '@/components/TENProvider/TENProvider';
export type { TenProviderProps } from '@/components/TENProvider/TENProvider';

// Connect Wallet Components
export { default as ConnectWalletButton } from '@/components/ConnectWallet/ConnectWalletButton';
export { default as ConnectWalletWrapper } from '@/components/ConnectWallet/ConnectWalletWrapper';
export { default as ConnectModal } from '@/components/ConnectWallet/ConnectModal';
export { default as WalletSettingsModal } from '@/components/ConnectWallet/WalletSettingsModal';

// Session Key Manager Components
export { default as SessionKeyManager } from '@/components/SessionKeyManager/SessionKeyManager';
export { default as SessionKeyInfo } from '@/components/SessionKeyManager/SessionKeyInfo';
export { default as SessionKeyFunding } from '@/components/SessionKeyManager/SessionKeyFunding';
export { default as SessionKeyTrash } from '@/components/SessionKeyManager/SessionKeyTrash';
export { default as SessionKeyTrashProgress } from '@/components/SessionKeyManager/SessionKeyTrashProgress';

// Stores
export { useSessionKeyStore } from '@/stores/sessionKey.store';
export { useSessionKeyManagerStore, DeletionState } from '@/stores/sessionKeyManager.store';

// Hooks
export { useSessionKey } from '@/hooks/useSessionKey';

// Contract methods
export { CreatePublicClients } from '@/lib/contractReadFunctions'
export type { TENPublicClients } from '@/lib/contractReadFunctions'

// Types
export type {
    EIP1193Provider,
    TransactionParams,
    StateSubscriber,
    SessionKeyStore,
    TenConfig,
    ConnectWalletWrapperProps,
    ConnectWalletButtonProps,
} from './lib/types';

// Constants
export {
    TEN_ADDRESSES,
    TEN_CHAIN_ID,
    DEFAULT_GAS_SETTINGS,
    LOCAL_STORAGE_KEY,
    DEFAULT_GATEWAY_URL,
    DEFAULT_TEN_CONFIG,
} from './lib/constants';

// Utilities
export {
    toHex,
    hexToBytes,
    bytesToHex,
    parseEther,
    formatEther,
    estimateTransactions,
    hexToAscii,
} from './lib/encoding';

export {
    getLatestBlockNumber,
    toRlpHex,
    checkTenNetwork,
    calculateGasFees,
    setupProviderListeners,
} from './lib/helpers';

export {
    cn,
    formatBalance,
    shortenAddress,
} from './lib/utils';
