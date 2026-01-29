# TEN Kit Examples

This directory contains standalone example applications demonstrating how to use `@tenprotocol/ten-kit` in different scenarios.

## Examples

### 1. [Basic Wallet Connect](./basic-app)

The simplest possible example - connect a wallet and display the connected address.

**What it demonstrates:**
- Setting up TEN Kit with wagmi
- Using the `ConnectWalletButton` component
- Reading wallet connection state
- Basic styling with Tailwind CSS

**Run it:**
```bash
cd basic-app
npm install
npm run dev
```

## Using These Examples

All examples use the local TEN Kit package (not from npm) via the `file:../..` dependency. This allows you to:

1. **Test changes** to the TEN Kit library immediately
2. **Debug** the library in a real application context
3. **Develop** new features with live feedback

### Setup Process

For any example:

1. **Build the TEN Kit library first** (from the root directory):
   ```bash
   cd /Users/pete/projects/TENConnect
   npm run build
   ```

2. **Navigate to the example**:
   ```bash
   cd examples/basic-app
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Run the example**:
   ```bash
   npm run dev
   ```

### Development Workflow

When making changes to the TEN Kit library:

1. Make your changes in the main library (`src/` directory)
2. Rebuild the library: `npm run build` (from root)
3. The example will automatically use the updated library
4. Refresh your browser to see the changes

**Tip:** You can use `npm run dev` in the root directory to watch for changes and rebuild automatically.

## Requirements

- Node.js 18+
- npm or yarn
- A Web3 wallet (MetaMask, Rabby, etc.)
- Connection to TEN Protocol network

## Contributing

When adding new examples:

1. Create a new directory in `examples/`
2. Set up as a standalone project
3. Use `"@tenprotocol/ten-kit": "file:../.."` in package.json
4. Include a comprehensive README.md
5. Update this main README with a link to your example

## Common Issues

### "Cannot find module '@tenprotocol/ten-kit'"

**Solution:** Build the main library first:
```bash
cd /Users/pete/projects/TENConnect
npm run build
```

### Changes to TEN Kit not reflecting

**Solution:** Rebuild the library and refresh your browser:
```bash
npm run build  # from root
```

### Module resolution errors

**Solution:** Delete `node_modules` and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

