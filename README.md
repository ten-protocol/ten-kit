# @ten-protocol/connect-react

React components and hooks for connecting dapps to TEN Protocol, featuring wallet connection, session key management, and privacy-preserving transactions.

## Features

- **Wallet Connection**: Easy wallet connection with TEN Protocol network detection
- **Session Keys**: Secure session key management for privacy-preserving transactions
- **UI Components**: Pre-built, customizable React components
- **TypeScript**: Full TypeScript support with comprehensive type definitions
- **Storybook**: Interactive component documentation and testing
- **Zustand**: Efficient state management with persistence
- **Wagmi Integration**: Built on top of wagmi for Ethereum interactions

## Installation

```bash
npm install @ten-protocol/connect-react
# or
yarn add @ten-protocol/connect-react
# or
pnpm add @ten-protocol/connect-react
```

### Peer Dependencies

Make sure you have the required peer dependencies installed:

```bash
npm install react react-dom wagmi viem @tanstack/react-query zustand
# or
yarn add react react-dom wagmi viem @tanstack/react-query zustand
# or
pnpm add react react-dom wagmi viem @tanstack/react-query zustand
```

**Required versions:**
- `react` >= 16.8.0
- `react-dom` >= 16.8.0
- `wagmi` ^2.0.0
- `viem` ^2.0.0
- `@tanstack/react-query` ^5.0.0
- `zustand` ^4.4.0

### CSS Import

Import the required CSS file in your app's entry point (e.g., `_app.tsx`, `main.tsx`, or `index.tsx`):

```tsx
import '@ten-protocol/connect-react/dist/styles.css';
```

This CSS file includes all the necessary styles for the components, including Tailwind utilities and custom component styles.

## Quick Start

### 1. Wrap your app with TenProvider

```tsx
import { TenProvider } from '@ten-protocol/connect-react';

function App() {
  return (
    <TENProvider>
      <YourDappContent />
    </TENProvider>
  );
}
```

### 2. Use the ConnectWalletWrapper

```tsx
import { ConnectWalletWrapper } from '@ten-protocol/connect-react';

function YourDappContent() {
  return (
      <TENProvider>
        <ConnectWalletWrapper loading={false}>
          <div>
            <h1>Your dApp Content</h1>
            <p>This content is only visible when connected to TEN Protocol</p>
          </div>
        </ConnectWalletWrapper>
      </TENProvider>
  );
}
```

### 3. Add a Connect Button

```tsx
import { ConnectWalletButton } from '@ten-protocol/connect-react';

function Header() {
  return (
    <header>
      <h1>My dApp</h1>
      <ConnectWalletButton />
    </header>
  );
}
```

### 4. Use Session Keys for Privacy

```tsx
import { useSessionKey } from '@ten-protocol/connect-react';
import { useConnectorClient } from 'wagmi';

function SessionKeyManager() {
  const { data: client } = useConnectorClient();
  const {
    sessionKey,
    balance,
    isLoading,
    createSessionKey,
    fundSessionKey,
    sendTransaction,
  } = useSessionKey();

  const handleCreateSessionKey = async () => {
    if (client) {
      await createSessionKey(client.provider);
    }
  };

  const handleSendTransaction = async () => {
    if (client && sessionKey) {
      const txHash = await sendTransaction(
        {
          to: '0x...',
          data: '0x...',
          value: '0x0',
        },
        client.provider
      );
      console.log('Transaction sent:', txHash);
    }
  };

  return (
    <div>
      {!sessionKey ? (
        <button onClick={handleCreateSessionKey} disabled={isLoading}>
          Create Session Key
        </button>
      ) : (
        <div>
          <p>Session Key: {sessionKey.slice(0, 6)}...{sessionKey.slice(-4)}</p>
          <p>Balance: {balance?.eth} ETH</p>
          <button onClick={handleSendTransaction}>Send Transaction</button>
        </div>
      )}
    </div>
  );
}
```

## API Reference

### Components

#### `TenProvider`

The main provider component that sets up wagmi and React Query for TEN Protocol.

```tsx
interface TenProviderProps {
  children: ReactNode;
  config?: TenConfig;
  queryClient?: QueryClient;
  enableSepolia?: boolean;
}
```

**Props:**
- `children`: Your app content
- `config`: Custom TEN Protocol configuration (optional)
- `queryClient`: Custom React Query client (optional)
- `enableSepolia`: Enable Sepolia testnet alongside TEN (optional, default: false)

#### `ConnectWalletWrapper`

A wrapper component that shows your content only when connected to TEN Protocol.

```tsx
interface ConnectWalletWrapperProps {
  children: React.ReactNode;
  className?: string;
  errorState?: boolean;
  loading: boolean;
  gatewayUrl?: string;
}
```

**Props:**
- `children`: Content to show when connected
- `className`: Additional CSS classes
- `errorState`: Show error state UI
- `loading`: Show loading state
- `gatewayUrl`: Custom TEN Gateway URL (optional)

#### `ConnectWalletButton`

A button component for wallet connection with built-in network detection.

```tsx
interface ConnectWalletButtonProps {
  className?: string;
  onChainChange?: (chainId: number, isCorrect: boolean) => void;
  gatewayUrl?: string;
}
```

**Props:**
- `className`: Additional CSS classes
- `onChainChange`: Callback when chain changes
- `gatewayUrl`: Custom TEN Gateway URL (optional)

### Hooks

#### `useSessionKey`

Hook for managing TEN Protocol session keys.

```tsx
const {
  // State
  sessionKey,
  isActive,
  balance,
  isLoading,
  error,
  
  // Actions
  createSessionKey,
  fundSessionKey,
  deleteSessionKey,
  cleanupSessionKey,
  updateBalance,
  sendTransaction,
  reset,
} = useSessionKey();
```

**Returns:**
- `sessionKey`: Current session key address
- `isActive`: Whether session key is active
- `balance`: Session key balance information
- `isLoading`: Loading state for operations
- `error`: Error state
- `createSessionKey(provider)`: Create a new session key
- `fundSessionKey(address, amount, provider, userAddress)`: Fund a session key
- `deleteSessionKey(provider)`: Delete current session key
- `cleanupSessionKey(provider)`: Cleanup session key
- `updateBalance(address, provider)`: Update session key balance
- `sendTransaction(txParams, provider)`: Send a privacy-preserving transaction
- `reset()`: Reset all state

### Constants

```tsx
import {
  TEN_ADDRESSES,
  TEN_CHAIN_ID,
  DEFAULT_GATEWAY_URL,
  DEFAULT_TEN_CONFIG,
} from '@ten-protocol/connect-react';
```

### Utilities

```tsx
import {
  formatBalance,
  shortenAddress,
  parseEther,
  formatEther,
  toHex,
} from '@ten-protocol/connect-react';
```

## Styling

This package uses Tailwind CSS for styling. You can customize the appearance by:

1. **Using CSS custom properties** (recommended):

```css
:root {
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* ... other custom properties */
}
```

2. **Overriding component classes**:

```tsx
<ConnectWalletButton className="bg-blue-500 hover:bg-blue-600" />
```

3. **Using your own Tailwind configuration** that includes the component styles.

## Storybook

This package includes Storybook for component development and testing:

```bash
npm run storybook
```

Visit `http://localhost:6006` to see all components with interactive examples.

## Development

### Building

```bash
npm run build
```

### Development mode

```bash
npm run dev
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Type checking

```bash
npm run type-check
```

## Examples

### Custom TEN Configuration

```tsx
import { TenProvider } from '@ten-protocol/connect-react';

const customConfig = {
  id: 8443,
  name: 'Custom TEN Network',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://your-custom-rpc.com'],
    },
  },
  blockExplorers: {
    default: { 
      name: 'Custom Explorer', 
      url: 'https://your-explorer.com' 
    },
  },
};

function App() {
  return (
    <TenProvider config={customConfig}>
      <YourApp />
    </TenProvider>
  );
}
```

### Error Handling

```tsx
import { ConnectWalletWrapper } from '@ten-protocol/connect-react';
import { useState, useEffect } from 'react';

function MyDapp() {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Your data fetching logic
    fetchData()
      .then(() => setLoading(false))
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  return (
    <ConnectWalletWrapper 
      loading={loading} 
      errorState={error}
    >
      <YourDappContent />
    </ConnectWalletWrapper>
  );
}
```

## License

MIT

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our repository.

## Support

For support, please visit our [documentation](https://docs.ten.xyz) or join our [Discord community](https://discord.gg/ten-protocol).
