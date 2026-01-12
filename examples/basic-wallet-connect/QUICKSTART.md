# Quick Start Guide

Get the basic wallet connect example up and running in 3 minutes.

## Prerequisites

- Node.js 18+ installed
- A Web3 wallet (MetaMask, Rabby, etc.) installed in your browser

## Steps

### 1. Build the TEN Kit Library

From the **root** of the TENConnect repository:

```bash
npm run build
```

This creates the distributable files in the `dist/` folder that the example will use.

### 2. Install Example Dependencies

From this directory (`examples/basic-wallet-connect`):

```bash
npm install
```

This installs all dependencies, including the local TEN Kit package.

### 3. Start the Development Server

```bash
npm run dev
```

The example will start on `http://localhost:3000`.

### 4. Test the Application

1. Open `http://localhost:3000` in your browser
2. Click the "Connect Wallet" button
3. Approve the connection in your Web3 wallet
4. You should see a success message with your connected wallet address!

## What's Next?

- Try modifying `src/App.tsx` to customize the UI
- Add more TEN Kit components like `SessionKeyManager`
- Check out the [main README](./README.md) for more details

## Troubleshooting

**Problem:** "Cannot find module '@tenprotocol/ten-kit'"  
**Solution:** Make sure you built the library first: `npm run build` from the root directory

**Problem:** Changes to TEN Kit not reflecting  
**Solution:** Rebuild the library and refresh your browser

**Problem:** Wallet not connecting  
**Solution:** Make sure you have a Web3 wallet extension installed and you're on the correct network

