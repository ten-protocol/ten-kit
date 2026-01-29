import { TENWagmiConfig, ConnectWalletButton, SessionKeyManager, TenConnectButton, useSessionKeyStore, useTheme } from '@tenprotocol/ten-kit';
import { WagmiProvider, createConfig, type CreateConfigParameters, useAccount, useReadContract } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { encodeFunctionData, parseEther, formatEther } from 'viem';
import FortuneCookieArtifact from './assets/contract/artifacts/contracts/FortuneCookie.sol/FortuneCookie.json';

const FORTUNE_COOKIE_ADDRESS = (import.meta as unknown as { env: { VITE_FC_CONTRACT_ADDRESS: string } }).env.VITE_FC_CONTRACT_ADDRESS as `0x${string}`;
const fortuneCookieAbi = FortuneCookieArtifact.abi;


const config = createConfig(TENWagmiConfig as CreateConfigParameters);
const queryClient = new QueryClient();

// Fortune Cookie Contract Interactions (using Session Key)
function FortuneCookieInteractions() {
  const [fortune, setFortune] = useState<string | null>(null);
  const [fortuneTxHash, setFortuneTxHash] = useState<string | null>(null);
  const [fortuneStatus, setFortuneStatus] = useState<'idle' | 'sending' | 'confirming' | 'confirmed' | 'error'>('idle');
  const [fortuneError, setFortuneError] = useState<string | null>(null);

  const [crackTxHash, setCrackTxHash] = useState<string | null>(null);
  const [crackStatus, setCrackStatus] = useState<'idle' | 'sending' | 'confirming' | 'confirmed' | 'error'>('idle');
  const [crackError, setCrackError] = useState<string | null>(null);

  // Get session key store for sending transactions
  const { sendTransaction, waitForReceipt, balance } = useSessionKeyStore();

  // Read greeting using wagmi (view function)
  const { data: greeting, isLoading: isLoadingGreeting, refetch: refetchGreeting } = useReadContract({
    address: FORTUNE_COOKIE_ADDRESS,
    abi: fortuneCookieAbi,
    functionName: 'getGreeting',
  });

  // Read cookies cracked counter
  const { data: cookiesCracked, refetch: refetchCookiesCracked } = useReadContract({
    address: FORTUNE_COOKIE_ADDRESS,
    abi: fortuneCookieAbi,
    functionName: 'cookiesCracked',
  });

  const handleGetGreeting = () => {
    refetchGreeting();
  };

  // Crack cookie - zero value mutating function via session key
  const handleCrackCookie = async () => {
    setCrackTxHash(null);
    setCrackError(null);
    setCrackStatus('sending');

    try {
      const data = encodeFunctionData({
        abi: fortuneCookieAbi,
        functionName: 'crackCookie',
      });

      const hash = await sendTransaction({
        to: FORTUNE_COOKIE_ADDRESS,
        data,
      });

      setCrackTxHash(hash);
      setCrackStatus('confirming');

      const receipt = await waitForReceipt(hash);
      
      if (receipt.status === '0x1') {
        setCrackStatus('confirmed');
        refetchCookiesCracked();
      } else {
        throw new Error('Transaction reverted');
      }
    } catch (err) {
      setCrackStatus('error');
      setCrackError(err instanceof Error ? err.message : 'Transaction failed');
      console.error('Crack cookie error:', err);
    }
  };

  // Buy fortune - payable function via session key
  const handleBuyFortune = async () => {
    setFortune(null);
    setFortuneTxHash(null);
    setFortuneError(null);
    setFortuneStatus('sending');

    try {
      const data = encodeFunctionData({
        abi: fortuneCookieAbi,
        functionName: 'buyFortune',
      });

      const hash = await sendTransaction({
        to: FORTUNE_COOKIE_ADDRESS,
        data,
        value: '0x' + parseEther('0.001').toString(16),
      });

      setFortuneTxHash(hash);
      setFortuneStatus('confirming');

      const receipt = await waitForReceipt(hash);
      
      if (receipt.status === '0x1') {
        setFortuneStatus('confirmed');
        setFortune("Fortune purchased via Session Key! Your mystical message awaits.");
      } else {
        throw new Error('Transaction reverted');
      }
    } catch (err) {
      setFortuneStatus('error');
      setFortuneError(err instanceof Error ? err.message : 'Transaction failed');
      console.error('Buy fortune error:', err);
    }
  };

  const isCrackDisabled = crackStatus === 'sending' || crackStatus === 'confirming';
  const isFortuneDisabled = fortuneStatus === 'sending' || fortuneStatus === 'confirming';

  return (
    <div className="space-y-4 pt-4 border-t border-green-200 dark:border-green-700">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-green-800 dark:text-green-300">
          Fortune Cookie Contract
        </h3>
        {balance && (
          <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded">
            SK Balance: {formatEther(BigInt(Math.floor(balance.eth * 1e18)))} ETH
          </span>
        )}
      </div>
      
      {/* Get Greeting Section - Uses wagmi (view call) */}
      <div className="bg-green-100/50 dark:bg-green-900/30 rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-green-700 dark:text-green-400 font-medium">Free Greeting (View Call)</span>
          <button
            onClick={handleGetGreeting}
            disabled={isLoadingGreeting}
            className="px-3 py-1.5 text-xs font-medium bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-md transition-colors"
          >
            {isLoadingGreeting ? 'Loading...' : 'Get Greeting'}
          </button>
        </div>
        {typeof greeting === 'string' && (
          <p className="text-sm text-green-800 dark:text-green-200 bg-white/50 dark:bg-slate-800/50 p-2 rounded italic">
            "{greeting}"
          </p>
        )}
      </div>

      {/* Crack Cookie Section - Zero value mutation via Session Key */}
      <div className="bg-blue-100/50 dark:bg-blue-900/30 rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-blue-700 dark:text-blue-400 font-medium">Crack Cookie (Free TX)</span>
            <span className="ml-2 text-xs text-blue-600 dark:text-blue-500 bg-blue-200/50 dark:bg-blue-800/30 px-1.5 py-0.5 rounded">
              via Session Key
            </span>
          </div>
          <button
            onClick={handleCrackCookie}
            disabled={isCrackDisabled}
            className="px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md transition-colors"
          >
            {crackStatus === 'sending' ? 'Sending...' : crackStatus === 'confirming' ? 'Confirming...' : 'Crack Cookie'}
          </button>
        </div>
        {cookiesCracked !== undefined && (
          <p className="text-xs text-blue-600 dark:text-blue-300 bg-white/50 dark:bg-slate-800/50 p-2 rounded">
            Total cookies cracked: {String(cookiesCracked)}
          </p>
        )}
        {crackTxHash && (
          <p className="text-xs text-blue-600 dark:text-blue-300 font-mono bg-white/50 dark:bg-slate-800/50 p-2 rounded break-all">
            Tx: {crackTxHash.slice(0, 10)}...{crackTxHash.slice(-8)}
          </p>
        )}
        {crackStatus === 'confirmed' && (
          <p className="text-sm text-blue-800 dark:text-blue-200 bg-white/50 dark:bg-slate-800/50 p-2 rounded">
            Cookie cracked successfully!
          </p>
        )}
        {crackError && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-100/50 dark:bg-red-900/30 p-2 rounded">
            Error: {crackError}
          </p>
        )}
      </div>

      {/* Buy Fortune Section - Payable via Session Key */}
      <div className="bg-amber-100/50 dark:bg-amber-900/30 rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-amber-700 dark:text-amber-400 font-medium">Buy Fortune (0.001 ETH)</span>
            <span className="ml-2 text-xs text-amber-600 dark:text-amber-500 bg-amber-200/50 dark:bg-amber-800/30 px-1.5 py-0.5 rounded">
              via Session Key
            </span>
          </div>
          <button
            onClick={handleBuyFortune}
            disabled={isFortuneDisabled}
            className="px-3 py-1.5 text-xs font-medium bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white rounded-md transition-colors"
          >
            {fortuneStatus === 'sending' ? 'Sending...' : fortuneStatus === 'confirming' ? 'Confirming...' : 'Buy Fortune'}
          </button>
        </div>
        {fortuneTxHash && (
          <p className="text-xs text-amber-600 dark:text-amber-300 font-mono bg-white/50 dark:bg-slate-800/50 p-2 rounded break-all">
            Tx: {fortuneTxHash.slice(0, 10)}...{fortuneTxHash.slice(-8)}
          </p>
        )}
        {fortune && (
          <p className="text-sm text-amber-800 dark:text-amber-200 bg-white/50 dark:bg-slate-800/50 p-2 rounded">
            {fortune}
          </p>
        )}
        {fortuneError && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-100/50 dark:bg-red-900/30 p-2 rounded">
            Error: {fortuneError}
          </p>
        )}
      </div>
    </div>
  );
}

// Dark mode toggle component
function DarkModeToggle({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="fixed top-4 right-4 p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200 dark:border-slate-600 z-50"
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <svg className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="w-6 h-6 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
}

function WalletStatus({ isDark, onToggleDark }: { isDark: boolean; onToggleDark: () => void }) {
  const { address, isConnected } = useAccount();
  const { sessionKey } = useSessionKeyStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <DarkModeToggle isDark={isDark} onToggle={onToggleDark} />
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-slate-900/50 p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            TEN Kit Example
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            Wallet Connection & Session Keys
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <TenConnectButton enableSessionKey />
          
          <div className="text-center pt-4 border-t border-gray-200 dark:border-slate-600 w-full">
            <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">Or use separate components:</p>
            <div className="flex justify-center gap-3">
              <ConnectWalletButton />
              <SessionKeyManager />
            </div>
          </div>
        </div>

        {isConnected ? (
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-6 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <h2 className="text-lg font-semibold text-green-900 dark:text-green-300">
                Wallet Connected!
              </h2>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                Connected Address:
              </p>
              <p className="text-xs text-green-600 dark:text-green-300 font-mono bg-green-100 dark:bg-green-900/50 p-2 rounded break-all">
                {address}
              </p>
            </div>
            {sessionKey ? (
              <div className="space-y-2 pt-2 border-t border-green-200 dark:border-green-700">
                <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                  Session Key:
                </p>
                <p className="text-xs text-green-600 dark:text-green-300 font-mono bg-green-100 dark:bg-green-900/50 p-2 rounded break-all">
                  {sessionKey}
                </p>
                <p className="text-sm text-green-700 dark:text-green-400">
                  Session key active - ready for private transactions!
                </p>
                <FortuneCookieInteractions />
              </div>
            ) : (
              <p className="text-sm text-green-700 dark:text-green-400">
                Connected! Create a session key for private transactions.
              </p>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-lg p-6 text-center">
            <p className="text-gray-600 dark:text-slate-300">
              Please connect your wallet to continue
            </p>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200 dark:border-slate-600">
          <p className="text-xs text-gray-500 dark:text-slate-400 text-center">
            This example demonstrates basic wallet connection using{' '}
            <span className="font-semibold">@tenprotocol/ten-kit</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// Force remove dark class immediately (before React hydration)
if (typeof document !== 'undefined') {
  document.documentElement.classList.remove('dark');
}

function App() {
  const [isDark, setIsDark] = useState(false);
  const { setDark, setLight } = useTheme();
  

  useEffect(() => {
    // Apply or remove dark class on html element
    if (isDark) {
      setDark();
      document.documentElement.classList.add('dark');
    } else {
      setLight();
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleDark = () => setIsDark(prev => !prev);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WalletStatus isDark={isDark} onToggleDark={toggleDark} />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;

