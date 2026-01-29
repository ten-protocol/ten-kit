# Basic Wallet Connect Example

A minimal example demonstrating wallet connection using `@tenprotocol/ten-kit`.

## Features

- Connect wallet to TEN Protocol
- Display connected wallet address
- Simple, clean UI with Tailwind CSS
- Uses local TEN Kit package for testing

## Setup

1. **Install dependencies:**

```bash
npm install
```

2. **Run the development server:**

```bash
npm run dev
```

3. **Open your browser:**

Navigate to `http://localhost:3000`

## What This Example Demonstrates

- Setting up `TENWagmiConfig` for TEN Protocol
- Using `ConnectWalletButton` component
- Reading wallet connection state with `useAccount` hook
- Displaying connected wallet address

## Project Structure

```
basic-wallet-connect/
├── src/
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles with Tailwind
├── index.html           # HTML template
├── package.json         # Dependencies (uses local ten-kit)
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── vite.config.ts       # Vite configuration
```

## Key Code

The core functionality is in `App.tsx`:

```tsx
import { TENWagmiConfig, ConnectWalletButton } from '@tenprotocol/ten-kit';
import { useAccount } from 'wagmi';

const config = createConfig(TENWagmiConfig);

function App() {
  const { address, isConnected } = useAccount();
  
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectWalletButton />
        {isConnected && <p>Connected: {address}</p>}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Preview Production Build

```bash
npm run preview
```

## Notes

- This example uses the local `@tenprotocol/ten-kit` package via `file:../..` dependency
- Make sure the parent TEN Kit library is built before running this example
- Requires MetaMask or another Web3 wallet browser extension

