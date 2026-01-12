import { TENWagmiConfig, ConnectWalletButton, SessionKeyManager, useSessionKeyStore } from '@tenprotocol/ten-kit';
import { WagmiProvider, createConfig, type CreateConfigParameters, useAccount } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const config = createConfig(TENWagmiConfig as CreateConfigParameters);
const queryClient = new QueryClient();

function WalletStatus() {
  const { address, isConnected } = useAccount();
  const { sessionKey } = useSessionKeyStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            TEN Kit Example
          </h1>
          <p className="text-gray-600">
            Wallet Connection & Session Keys
          </p>
        </div>

        <div className="flex justify-center gap-3">
          <ConnectWalletButton />
          <SessionKeyManager />
        </div>

        {isConnected ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <h2 className="text-lg font-semibold text-green-900">
                Wallet Connected!
              </h2>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-green-700 font-medium">
                Connected Address:
              </p>
              <p className="text-xs text-green-600 font-mono bg-green-100 p-2 rounded break-all">
                {address}
              </p>
            </div>
            {sessionKey ? (
              <div className="space-y-2 pt-2 border-t border-green-200">
                <p className="text-sm text-green-700 font-medium">
                  Session Key:
                </p>
                <p className="text-xs text-green-600 font-mono bg-green-100 p-2 rounded break-all">
                  {sessionKey}
                </p>
                <p className="text-sm text-green-700">
                  🔐 Session key active - ready for private transactions!
                </p>
              </div>
            ) : (
              <p className="text-sm text-green-700">
                🎉 Connected! Create a session key for private transactions.
              </p>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <p className="text-gray-600">
              Please connect your wallet to continue
            </p>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            This example demonstrates basic wallet connection using{' '}
            <span className="font-semibold">@tenprotocol/ten-kit</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WalletStatus />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;

