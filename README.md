# @ten-protocol/ten-kit

React components and hooks for connecting dapps to TEN Protocol, featuring wallet connection, session key management, and privacy-preserving transactions.

**Built on [wagmi](https://wagmi.sh/)** - This library provides a complete wagmi setup pre-configured for TEN Protocol, so you get all the power of wagmi with zero configuration needed.

## Features

- **Wallet Connection**: Easy wallet connection with TEN Protocol network detection
- **Session Keys**: Secure session key management for privacy-preserving transactions
- **UI Components**: Pre-built, customizable React components
- **TypeScript**: Full TypeScript support with comprehensive type definitions
- **Storybook**: Interactive component documentation and testing
- **Zustand**: Efficient state management with persistence
- **Wagmi Integration**: Built on top of wagmi v2 - get all wagmi hooks with TEN Protocol pre-configured

## Installation

```bash
npm install @ten-protocol/ten-kit
# or
yarn add @ten-protocol/ten-kit
# or
pnpm add @ten-protocol/ten-kit
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
- **`wagmi` ^2.0.0** - Core Ethereum hooks library (automatically configured for TEN)
- **`viem` ^2.0.0** - Ethereum utilities used by wagmi
- **`@tanstack/react-query` ^5.0.0** - Data fetching library used by wagmi
- `zustand` ^4.4.0 - State management for session keys

> **Note:** `TENProvider` includes `WagmiProvider` and `QueryClientProvider`, so you don't need to set these up separately. The library handles all wagmi configuration for TEN Protocol automatically.

### CSS Import

Import the required CSS file in your app's entry point (e.g., `_app.tsx`, `main.tsx`, or `index.tsx`):

```tsx
import '@tenprotocol/ten-kit/styles.css';
```

This CSS file includes all the necessary styles for the components, including Tailwind utilities and custom component styles.

## How it Works with Wagmi

This library is built on top of [wagmi](https://wagmi.sh/) and provides:

**Pre-configured wagmi setup** for TEN Protocol - no manual wagmi config needed  
**All wagmi hooks available** - use `useAccount`, `useBalance`, `useReadContract`, etc.  
**WagmiProvider and QueryClientProvider** - automatically wrapped by `TENProvider`  
**Custom connectors** - includes injected wallet connector with TEN Protocol support

**You don't need to set up wagmi separately** - just wrap your app with `TENProvider` and you're ready to use any wagmi hook alongside TEN-specific features.

```tsx
import { TENProvider, useSessionKeyStore } from '@tenprotocol/ten-kit';
import { useAccount, useBalance } from 'wagmi'; // wagmi hooks work out of the box!

function MyApp() {
  return (
    <TENProvider>
      <MyComponent />
    </TENProvider>
  );
}

function MyComponent() {
  const { address } = useAccount(); // wagmi hook
  const { sessionKey } = useSessionKeyStore(); // ten-kit hook
  // Both work seamlessly together!
}
```

## Quick Start

### Basic Example: Wallet Connection Only

The simplest setup - just wallet connection without session keys:

```tsx
import React from 'react';
import { TENProvider, ConnectWalletButton } from '@tenprotocol/ten-kit';
import { useAccount } from 'wagmi';

const MyDApp = () => (
  <TENProvider>
    <div className="p-8 max-w-md mx-auto">
      <header className="flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-4">My TEN dApp</h1>
        <ConnectWalletButton />
      </header>
      <AppContent />
    </div>
  </TENProvider>
);

const AppContent = () => {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return <p>Please connect your wallet.</p>;
  }

  return (
    <div className="text-center space-y-4">
      <p className="text-gray-600">
        Your dApp content goes here. It will only be visible when
        the user is connected to TEN Protocol.
      </p>
      <button className="w-full bg-blue-500 text-white py-2 px-4 rounded">
        Private Action
      </button>
    </div>
  );
};

export default MyDApp;
```

### Advanced Example: With Session Keys

For privacy-preserving transactions, add the `SessionKeyManager` component:

```tsx
import React from 'react';
import { 
  TENProvider, 
  ConnectWalletButton, 
  SessionKeyManager,
  useSessionKeyStore 
} from '@tenprotocol/ten-kit';
import { useAccount } from 'wagmi';

const MyDApp = () => (
  <TENProvider>
    <div className="p-8 max-w-md mx-auto">
      <header className="flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-4">My TEN dApp</h1>
        <div className="flex gap-4 justify-center mb-6">
          <ConnectWalletButton />
          <SessionKeyManager />
        </div>
      </header>
      <AppContent />
    </div>
  </TENProvider>
);

const AppContent = () => {
  const { isConnected } = useAccount();
  const { sessionKey } = useSessionKeyStore();

  if (!isConnected || !sessionKey) {
    return <p>Please connect your wallet and create a session key.</p>;
  }

  return (
    <div className="text-center space-y-4">
      <p className="text-gray-600">
        Your dApp content goes here. All transactions are
        privacy-preserving thanks to TEN Protocol.
      </p>
      <button className="w-full bg-blue-500 text-white py-2 px-4 rounded">
        Private Action
      </button>
    </div>
  );
};

export default MyDApp;
```

### Sending Transactions with Session Keys

Use the `sendTransaction` method from `useSessionKeyStore` to send privacy-preserving transactions:

```tsx
import React, { useState } from 'react';
import { useSessionKeyStore } from '@tenprotocol/ten-kit';
import { encodeFunctionData, parseEther } from 'viem';
import { useAccount } from 'wagmi';

const MyContractComponent = () => {
  const { isConnected } = useAccount();
  const { sendTransaction, sessionKey } = useSessionKeyStore();
  const [amount, setAmount] = useState('0.01');

  const handleTransaction = async () => {
    if (!isConnected || !sessionKey) {
      alert('Please connect wallet and create a session key');
      return;
    }

    try {
      // Encode contract function call
      const data = encodeFunctionData({
        abi: YOUR_CONTRACT_ABI,
        functionName: 'yourFunction',
        args: [/* your args */],
      });

      // Send transaction through session key
      const txHash = await sendTransaction({
        to: '0xYourContractAddress',
        value: `0x${parseEther(amount).toString(16)}`,
        data,
      });

      console.log('Transaction sent:', txHash);
    } catch (error) {
      console.error('Transaction failed:', error);
    }
  };

  return (
    <div>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />
      <button onClick={handleTransaction}>
        Send Transaction
      </button>
    </div>
  );
};
```

## API Reference

### Components

#### `TENProvider`

The main provider component that sets up wagmi and React Query for TEN Protocol.

**What it does:**
- Wraps your app with `WagmiProvider` configured for TEN Protocol
- Wraps your app with `QueryClientProvider` for data fetching
- Configures injected wallet connector (MetaMask, Rabby, etc.)
- Sets up TEN Protocol chain configuration
- Enables all wagmi hooks to work with TEN Protocol

```tsx
interface TENProviderProps {
  children: ReactNode;
  config?: TenConfig;
  queryClient?: QueryClient;
}
```

**Props:**
- `children`: Your app content
- `config`: Custom TEN Protocol chain configuration (optional)
- `queryClient`: Custom React Query client instance (optional)

**Basic Usage:**
```tsx
import { TENProvider } from '@tenprotocol/ten-kit';

function App() {
  return (
    <TENProvider>
      <YourDappContent />
    </TENProvider>
  );
}
```

**Advanced Usage with Custom QueryClient:**
```tsx
import { TENProvider } from '@tenprotocol/ten-kit';
import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <TENProvider queryClient={queryClient}>
      <YourDappContent />
    </TENProvider>
  );
}
```

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

**Usage:**
```tsx
import { ConnectWalletButton } from '@tenprotocol/ten-kit';

function Header() {
  return <ConnectWalletButton />;
}
```

#### `SessionKeyManager`

A complete session key management UI component with create, fund, and delete capabilities.

**Props:**
- None required (uses internal state management)

**Features:**
- Create new session keys
- Fund session keys with ETH
- Display session key balance
- Delete session keys
- Automatic balance updates

**Usage:**
```tsx
import { SessionKeyManager } from '@tenprotocol/ten-kit';

function Header() {
  return (
    <div className="flex gap-4">
      <ConnectWalletButton />
      <SessionKeyManager />
    </div>
  );
}
```

### Hooks

#### `useSessionKeyStore`

**Recommended:** The main hook for accessing and managing session keys. Use this for sending transactions and checking session key state.

```tsx
const {
  // State
  sessionKey,
  isActive,
  balance,
  isLoading,
  error,
  
  // Actions
  sendTransaction,
  createSessionKey,
  fundSessionKey,
  deleteSessionKey,
  updateBalance,
  reset,
} = useSessionKeyStore();
```

**State:**
- `sessionKey`: Current session key address (string | null)
- `isActive`: Whether session key is active (boolean)
- `balance`: Session key balance object with `eth` and `wei` properties
- `isLoading`: Loading state for operations (boolean)
- `error`: Error state (Error | null)

**Actions:**
- `sendTransaction(txParams)`: Send a privacy-preserving transaction through the session key
  - `txParams`: `{ to: string, value: string, data: string }`
  - Returns: `Promise<string>` (transaction hash)
- `waitForReceipt(txHash, timeout?)`: Wait for transaction receipt and confirmation
  - `txHash`: Transaction hash from `sendTransaction`
  - `timeout`: Optional timeout in milliseconds (default: 30000)
  - Returns: `Promise<TransactionReceipt>` (full receipt with logs and status)
  - Throws: Error if transaction reverts or timeout is exceeded
- `createSessionKey()`: Create a new session key
- `fundSessionKey(address, amount, userAddress)`: Fund a session key with ETH
- `deleteSessionKey()`: Delete the current session key
- `updateBalance()`: Manually refresh the session key balance
- `reset()`: Reset all state

**Example:**
```tsx
import { useSessionKeyStore } from '@tenprotocol/ten-kit';
import { encodeFunctionData, parseEther, parseEventLogs } from 'viem';

function MyComponent() {
  const { sessionKey, sendTransaction, waitForReceipt } = useSessionKeyStore();

  const handleTransaction = async () => {
    const data = encodeFunctionData({
      abi: MyContractABI,
      functionName: 'myFunction',
    });

    const txHash = await sendTransaction({
      to: '0xContractAddress',
      value: `0x${parseEther('0.01').toString(16)}`,
      data,
    });

    // Wait for confirmation and get receipt
    const receipt = await waitForReceipt(txHash);
    console.log('Status:', receipt.status);
    
    // Parse event logs
    const events = parseEventLogs({
      abi: MyContractABI,
      logs: receipt.logs,
    });
    console.log('Events:', events);
  };

  return <button onClick={handleTransaction}>Send TX</button>;
}
```

#### `useSessionKey`

A simplified hook that wraps `useSessionKeyStore`. Use `useSessionKeyStore` directly for better performance.

```tsx
const {
  sessionKey,
  isActive,
  balance,
  isLoading,
  error,
  createSessionKey,
  fundSessionKey,
  deleteSessionKey,
  cleanupSessionKey,
  updateBalance,
  sendTransaction,
  reset,
} = useSessionKey();
```

### Constants

```tsx
import {
  TEN_ADDRESSES,
  TEN_CHAIN_ID,
  DEFAULT_GATEWAY_URL,
  DEFAULT_TEN_CONFIG,
} from '@ten-protocol/ten-kit';
```

### Utilities

The package exports several utility functions for common operations:

#### Formatting Utilities

```tsx
import { formatBalance, shortenAddress } from '@tenprotocol/ten-kit';

// Format ETH balance for display
const formatted = formatBalance('1.23456789'); // '1.23'

// Shorten Ethereum address
const short = shortenAddress('0x1234...5678'); // '0x12...5678'
```

#### Encoding/Decoding Utilities

```tsx
import {
  parseEther,
  formatEther,
  toHex,
  hexToBytes,
  bytesToHex,
  hexToAscii,
} from '@tenprotocol/ten-kit';

// Convert ETH to wei
const wei = parseEther('1.0'); // 1000000000000000000n

// Convert wei to ETH
const eth = formatEther(wei); // '1.0'

// Convert number to hex
const hex = toHex(255); // '0xff'

// Convert hex to bytes
const bytes = hexToBytes('0xff');

// Convert bytes to hex
const hexStr = bytesToHex(bytes);

// Convert hex to ASCII
const ascii = hexToAscii('0x48656c6c6f'); // 'Hello'
```

#### Helper Functions

```tsx
import {
  checkTenNetwork,
  calculateGasFees,
  getLatestBlockNumber,
} from '@tenprotocol/ten-kit';

// Verify connected to TEN network
await checkTenNetwork(provider);

// Calculate gas fees for transaction
const { maxFeePerGas, maxPriorityFeePerGas } = await calculateGasFees(provider);

// Get latest block number
const blockNumber = await getLatestBlockNumber(provider);
```

#### `CreatePublicClients`

Creates configured viem public clients for reading public on-chain data and listening to events without requiring wallet connection.

```tsx
import { CreatePublicClients, type TENPublicClients } from '@tenprotocol/ten-kit';

// Initialize public clients
const clients: TENPublicClients = await CreatePublicClients();

// Use HTTP client for reading contract data
const totalSupply = await clients.httpsClient.readContract({
  address: '0xYourContract',
  abi: YOUR_ABI,
  functionName: 'totalSupply',
});

const balance = await clients.httpsClient.readContract({
  address: '0xYourContract',
  abi: YOUR_ABI,
  functionName: 'balanceOf',
  args: ['0xUserAddress'],
});

// Use WebSocket client for listening to events
const unwatch = clients.websocketClient.watchContractEvent({
  address: '0xYourContract',
  abi: YOUR_ABI,
  eventName: 'Transfer',
  onLogs: (logs) => {
    console.log('New transfer events:', logs);
  },
});

// Clean up when done
unwatch();
```

**Returns:**
```tsx
interface TENPublicClients {
  httpsClient: PublicClient<Transport, Chain>;
  websocketClient: PublicClient<Transport, Chain>;
}
```

**Features:**
- Automatically manages TEN network authentication tokens
- Caches tokens in localStorage with 24-hour expiration
- Handles token refresh and revocation automatically
- Retry logic with exponential backoff for network failures
- Full viem public client API support

**Use Cases:**
- Reading contract state without wallet connection
- Watching blockchain events in real-time
- Building read-only dashboards and analytics
- Displaying token balances and supply information
- Monitoring contract events for notifications

See the [Fetching Public Data and Listening for Events](#fetching-public-data-and-listening-for-events) example for a complete implementation.

## TypeScript

This package is written in TypeScript and exports all necessary types:

```tsx
import type {
  // Provider Props
  TenProviderProps,
  
  // Component Props
  ConnectWalletButtonProps,
  ConnectWalletWrapperProps,
  
  // Session Key Types
  SessionKeyStore,
  TransactionParams,
  TransactionReceipt,
  
  // Public Clients
  TENPublicClients,
  
  // Configuration
  TenConfig,
  EIP1193Provider,
} from '@tenprotocol/ten-kit';

// Example: Transaction Parameters
const txParams: TransactionParams = {
  to: '0x...',
  value: '0x0',
  data: '0x...',
};

// Example: Working with receipts
const receipt: TransactionReceipt = await waitForReceipt(txHash);
console.log('Status:', receipt.status);
console.log('Gas used:', receipt.gasUsed);
console.log('Logs:', receipt.logs);

// Example: Custom Config
const config: TenConfig = {
  id: 8443,
  name: 'TEN Protocol',
  // ...
};
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

### Next.js Setup

For Next.js applications, set up your providers in a client component:

```tsx
// app/layout.tsx
import '@tenprotocol/ten-kit/styles.css';
import './globals.css';
import Providers from './providers';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

```tsx
// app/providers.tsx
'use client';

import { TENProvider } from '@tenprotocol/ten-kit';
import { QueryClient } from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <TENProvider queryClient={queryClient}>
      {children}
    </TENProvider>
  );
}
```

### Using Wagmi Hooks

Since this library is built on wagmi, you can use any wagmi hook alongside TEN-specific features:

```tsx
import { TENProvider, useSessionKeyStore, ConnectWalletButton } from '@tenprotocol/ten-kit';
import { 
  useAccount, 
  useBalance, 
  useBlockNumber,
  useReadContract,
  useWatchBlockNumber 
} from 'wagmi';

function MyComponent() {
  // Wagmi hooks work out of the box
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { data: blockNumber } = useBlockNumber();
  
  // TEN-specific hooks
  const { sessionKey, sendTransaction } = useSessionKeyStore();
  
  // Read from a contract
  const { data: contractData } = useReadContract({
    address: '0xYourContract',
    abi: YOUR_ABI,
    functionName: 'getData',
  });

  return (
    <div>
      <p>Address: {address}</p>
      <p>Balance: {balance?.formatted} ETH</p>
      <p>Block: {blockNumber?.toString()}</p>
      <p>Session Key: {sessionKey ? 'Active' : 'None'}</p>
      <p>Contract Data: {contractData}</p>
    </div>
  );
}

function App() {
  return (
    <TENProvider>
      <ConnectWalletButton />
      <MyComponent />
    </TENProvider>
  );
}
```

### Complete Example with Contract Interaction

Real-world example showing how to interact with a smart contract using session keys:

```tsx
import { useState } from 'react';
import { useSessionKeyStore } from '@tenprotocol/ten-kit';
import { encodeFunctionData, parseEther } from 'viem';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';

const CONTRACT_ADDRESS = '0xYourContractAddress';
const CONTRACT_ABI = [/* your ABI */];

export default function BettingComponent() {
  const { isConnected } = useAccount();
  const { sendTransaction, sessionKey } = useSessionKeyStore();
  const [betAmount, setBetAmount] = useState('0.01');
  const [isLoading, setIsLoading] = useState(false);

  const handlePlaceBet = async () => {
    if (!isConnected || !sessionKey) {
      toast.error('Please connect your wallet and create a session key');
      return;
    }

    setIsLoading(true);
    try {
      // Encode the contract function call
      const data = encodeFunctionData({
        abi: CONTRACT_ABI,
        functionName: 'placeBet',
      });

      // Send transaction through session key
      const txHash = await sendTransaction({
        to: CONTRACT_ADDRESS,
        value: `0x${parseEther(betAmount).toString(16)}`,
        data,
      });

      toast.success(`Bet placed! TX: ${txHash}`);
      console.log('Transaction hash:', txHash);
    } catch (error) {
      console.error('Error placing bet:', error);
      toast.error('Failed to place bet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <input
        type="number"
        value={betAmount}
        onChange={(e) => setBetAmount(e.target.value)}
        placeholder="Bet Amount (ETH)"
        min="0.001"
        step="0.001"
      />
      <button 
        onClick={handlePlaceBet} 
        disabled={isLoading || !sessionKey}
      >
        {isLoading ? 'Processing...' : 'Place Bet'}
      </button>
    </div>
  );
}
```

### Using Session Key Store in Another Zustand Store

If you're building complex applications with multiple Zustand stores, you can access the session key store from within your other stores using `getState()`:

```tsx
import { create } from 'zustand';
import { useSessionKeyStore } from '@tenprotocol/ten-kit';
import { Address, formatEther } from 'viem';

export type GameEvent = {
  gameId: bigint;
  player: Address;
  amount: bigint;
};

export type GameStore = {
  playerHasBet: boolean;
  bets: Array<{ player: Address; amount: number }>;
  handleBetPlaced: (event: GameEvent) => void;
};

export const useGameStore = create<GameStore>()((set, get) => ({
  playerHasBet: false,
  bets: [],

  handleBetPlaced: (event) => {
    // Access session key from the session key store
    const { sessionKey } = useSessionKeyStore.getState();

    // Check if the bet was placed by the current user's session key
    const isPlayerBet = sessionKey?.toUpperCase() === event.player.toUpperCase();

    if (isPlayerBet) {
      set({ playerHasBet: true });
    }

    // Add bet to the list
    set({
      bets: [
        {
          player: event.player,
          amount: Number(formatEther(event.amount)),
        },
        ...get().bets,
      ],
    });
  },
}));
```

**Key Points:**
- Use `useSessionKeyStore.getState()` to access the store from outside React components
- This is useful for event handlers, middleware, or other Zustand stores
- The session key is stored as a string (the address) or `null` if not created
- You can also access `sendTransaction`, `balance`, and other store properties this way

**Another Example - Checking if User is Connected:**

```tsx
import { create } from 'zustand';
import { useSessionKeyStore } from '@tenprotocol/ten-kit';

export const useAppStore = create()((set) => ({
  isReady: false,
  
  checkReadyState: () => {
    const { sessionKey, isActive } = useSessionKeyStore.getState();
    
    // Check if user has an active session key
    if (sessionKey && isActive) {
      set({ isReady: true });
    } else {
      set({ isReady: false });
    }
  },
}));
```

### Fetching Public Data and Listening for Events

For reading public on-chain data and listening to events without requiring a wallet connection, you can use `CreatePublicClients` to get configured viem public clients:

```tsx
import { useEffect, useState } from 'react';
import { CreatePublicClients, type TENPublicClients } from '@tenprotocol/ten-kit';
import { formatEther, parseAbi } from 'viem';

const CONTRACT_ADDRESS = '0xYourContractAddress';
const CONTRACT_ABI = parseAbi([
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 value)',
]);

function PublicDataComponent() {
  const [clients, setClients] = useState<TENPublicClients | null>(null);
  const [totalSupply, setTotalSupply] = useState<string>('0');
  const [userBalance, setUserBalance] = useState<string>('0');
  const [latestTransfer, setLatestTransfer] = useState<string | null>(null);

  useEffect(() => {
    const initClients = async () => {
      try {
        const publicClients = await CreatePublicClients();
        setClients(publicClients);
      } catch (error) {
        console.error('Failed to initialize public clients:', error);
      }
    };

    initClients();
  }, []);

  useEffect(() => {
    if (!clients) return;

    const fetchData = async () => {
      try {
        const supply = await clients.httpsClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'totalSupply',
        });
        setTotalSupply(formatEther(supply as bigint));

        const balance = await clients.httpsClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: CONTRACT_ABI,
          functionName: 'balanceOf',
          args: ['0xUserAddress'],
        });
        setUserBalance(formatEther(balance as bigint));
      } catch (error) {
        console.error('Error fetching contract data:', error);
      }
    };

    fetchData();

    const unwatch = clients.websocketClient.watchContractEvent({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      eventName: 'Transfer',
      onLogs: (logs) => {
        logs.forEach((log) => {
          if (log.args) {
            const { from, to, value } = log.args;
            setLatestTransfer(
              `${from} → ${to}: ${formatEther(value as bigint)} tokens`
            );
          }
        });
      },
    });

    return () => {
      unwatch();
    };
  }, [clients]);

  return (
    <div>
      <h2>Token Information</h2>
      <p>Total Supply: {totalSupply} tokens</p>
      <p>User Balance: {userBalance} tokens</p>
      {latestTransfer && (
        <div>
          <h3>Latest Transfer:</h3>
          <p>{latestTransfer}</p>
        </div>
      )}
    </div>
  );
}

export default PublicDataComponent;
```

**Key Features:**
- **No wallet connection required** - `CreatePublicClients` works independently
- **Automatic token management** - Handles TEN network authentication tokens with caching and expiration
- **HTTP and WebSocket support** - Get both client types for different use cases
- **Standard viem API** - Use all viem public client methods (`readContract`, `watchContractEvent`, `getBlockNumber`, etc.)
- **Event listening** - Real-time event monitoring via WebSocket with automatic reconnection

**Common Use Cases:**
```tsx
// Read contract state
const balance = await clients.httpsClient.readContract({
  address: CONTRACT_ADDRESS,
  abi: YOUR_ABI,
  functionName: 'balanceOf',
  args: ['0xUserAddress'],
});

// Read multiple contract values
const [supply, paused] = await Promise.all([
  clients.httpsClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: YOUR_ABI,
    functionName: 'totalSupply',
  }),
  clients.httpsClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: YOUR_ABI,
    functionName: 'paused',
  }),
]);

// Watch for contract events in real-time
const unwatchEvents = clients.websocketClient.watchContractEvent({
  address: CONTRACT_ADDRESS,
  abi: CONTRACT_ABI,
  eventName: 'MyEvent',
  onLogs: (logs) => {
    logs.forEach((log) => console.log('New event:', log));
  },
});
```

### Custom TEN Configuration

You can provide a custom configuration for different TEN networks:

```tsx
import { TENProvider } from '@tenprotocol/ten-kit';
import { QueryClient } from '@tanstack/react-query';

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
};

const queryClient = new QueryClient();

function App() {
  return (
    <TENProvider config={customConfig} queryClient={queryClient}>
      <YourApp />
    </TENProvider>
  );
}
```

## License

MIT

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our repository.

## Support

For support, please visit our [documentation](https://docs.ten.xyz) or join our [Discord community](https://discord.gg/ten-protocol).
