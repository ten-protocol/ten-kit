import { useEffect, useState } from 'react';
import { useAccount, useDisconnect, useBalance } from 'wagmi';
import { ChevronDown, Wallet, Key, LogOut, Settings, Loader2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn, formatBalance } from '@/lib/utils';
import { DEFAULT_GATEWAY_URL, TEN_CHAIN_ID } from '@/lib/constants';
import { useUIStore } from '@/stores/ui.store';
import { useThemeStore } from '@/stores/theme.store';
import { useSessionKeyStore } from '@/stores/sessionKey.store';
import { useSessionKeyManagerStore, DeletionState } from '@/stores/sessionKeyManager.store';
import ConnectModal from './ConnectModal';
import WalletSettingsModal from './WalletSettingsModal';
import SessionKeyManager from '../SessionKeyManager/SessionKeyManager';

interface TenConnectButtonProps {
    className?: string;
    style?: React.CSSProperties;
    onChainChange?: (chainId: number, isCorrect: boolean) => void;
    gatewayUrl?: string;
    onTrackEvent?: (event: string, data: any) => void;
    /** Enable session key functionality. When false, only wallet connection is available. Default: false */
    enableSessionKey?: boolean;
}

export default function TenConnectButton({
    className,
    style,
    onChainChange,
    gatewayUrl = DEFAULT_GATEWAY_URL,
    onTrackEvent,
    enableSessionKey = false,
}: TenConnectButtonProps) {
    const { address, isConnected, chain, connector } = useAccount();
    const { disconnect } = useDisconnect();
    const {
        isConnectModalOpen,
        isSettingsModalOpen,
        setConnectModalOpen,
        setSettingsModalOpen,
        setSessionKeyModalOpen,
    } = useUIStore();
    const resolvedTheme = useThemeStore((state) => state.resolvedTheme);

    const isWrongChain = !chain || Number(chain.id) !== Number(TEN_CHAIN_ID);

    // Session key state (only used when enableSessionKey is true)
    const { sessionKey, balance: sessionBalance, isLoading } = useSessionKeyStore();
    const { 
        initSession, 
        startSession, 
        deletionState, 
        confirmDeleteSession, 
        isRefreshingBalance,
        fundSession,
        withdrawAmountAction,
        isTransacting,
        resetDeletionState,
    } = useSessionKeyManagerStore();

    const { data: ethBalance, isLoading: isLoadingEthBalance } = useBalance({
        address,
        chainId: TEN_CHAIN_ID,
        query: {
            enabled: isConnected && !isWrongChain,
            refetchInterval: 5000,
        },
    });

    // Get wallet balance for funding validation
    const { data: walletBalance } = useBalance({
        address,
        query: {
            refetchInterval: 5000,
        },
    });

    // Local state for dialogs
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [isFundDialogOpen, setIsFundDialogOpen] = useState(false);
    const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
    const [fundAmount, setFundAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [fundError, setFundError] = useState('');
    const [withdrawError, setWithdrawError] = useState('');

    // Initialize session when connector is available (only if session keys enabled)
    useEffect(() => {
        if (enableSessionKey && connector) {
            initSession(connector);
        }
    }, [connector, initSession, enableSessionKey]);

    // Reset deletion state when session key changes (new session created)
    useEffect(() => {
        if (sessionKey && deletionState === DeletionState.COMPLETED) {
            resetDeletionState();
        }
    }, [sessionKey, deletionState, resetDeletionState]);

    useEffect(() => {
        if (isConnected && !isWrongChain && onTrackEvent) {
            onTrackEvent('wallet_connected', {
                timestamp: new Date().toISOString(),
                wallet: address,
            });
        }
    }, [isConnected, chain, address, isWrongChain, onTrackEvent]);

    useEffect(() => {
        if (onChainChange && chain) {
            onChainChange(chain.id, !isWrongChain);
        }
    }, [chain, isWrongChain, onChainChange]);

    // Validation functions
    const validateFundAmount = (amount: string) => {
        if (!amount || amount === '') {
            setFundError('');
            return false;
        }

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            setFundError('Please enter a valid amount');
            return false;
        }

        if (walletBalance) {
            const walletBalanceNum = parseFloat(walletBalance.formatted);
            const gasReserve = 0.001;
            const maxAvailable = walletBalanceNum - gasReserve;

            if (numAmount > maxAvailable) {
                setFundError(`Amount exceeds available balance`);
                return false;
            }
        }

        setFundError('');
        return true;
    };

    const validateWithdrawAmount = (amount: string) => {
        if (!amount || amount === '') {
            setWithdrawError('');
            return false;
        }

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            setWithdrawError('Please enter a valid amount');
            return false;
        }

        const sessionKeyBalance = parseFloat(sessionBalance?.eth?.toString() || '0');
        const gasReserve = 0.0002;
        const maxAvailable = sessionKeyBalance - gasReserve;

        if (numAmount > maxAvailable) {
            setWithdrawError(`Amount exceeds available balance`);
            return false;
        }

        setWithdrawError('');
        return true;
    };

    // Helper functions
    const getWalletBalance = () => {
        return walletBalance ? parseFloat(walletBalance.formatted) : 0;
    };

    const getSessionKeyBalance = () => {
        return parseFloat(sessionBalance?.eth?.toString() || '0');
    };

    const setFundAmountPercentage = (percentage: number) => {
        const balance = getWalletBalance();
        const gasReserve = 0.001;
        const availableBalance = Math.max(0, balance - gasReserve);
        const amount = Math.floor(((availableBalance * percentage) / 100) * 1000) / 1000;
        setFundAmount(amount.toFixed(3));
    };

    const setWithdrawAmountPercentage = (percentage: number) => {
        const balance = getSessionKeyBalance();
        const gasReserve = 0.0002;
        const availableBalance = Math.max(0, balance - gasReserve);
        const amount = Math.floor(((availableBalance * percentage) / 100) * 1000) / 1000;
        setWithdrawAmount(amount.toFixed(3));
    };

    const handleStartSession = async () => {
        await startSession(isConnected);
    };

    const handleEndSessionClick = () => {
        setIsDeleteAlertOpen(true);
    };

    const handleConfirmDeleteSession = async () => {
        if (address) {
            setIsDeleteAlertOpen(false);
            await confirmDeleteSession(address, isConnected);
        }
    };

    const handleDisconnect = () => {
        disconnect();
    };

    const handleOpenWalletInfo = () => {
        setSettingsModalOpen(true);
    };

    const handleOpenSessionKeyManager = () => {
        setSessionKeyModalOpen(true);
    };

    const handleOpenFundDialog = () => {
        setFundAmount('');
        setFundError('');
        setIsFundDialogOpen(true);
    };

    const handleOpenWithdrawDialog = () => {
        setWithdrawAmount('');
        setWithdrawError('');
        setIsWithdrawDialogOpen(true);
    };

    const handleFundSession = async () => {
        if (!validateFundAmount(fundAmount)) return;
        if (address) {
            await fundSession(fundAmount, address, isConnected);
            setFundAmount('');
            setIsFundDialogOpen(false);
        }
    };

    const handleWithdrawAmount = async () => {
        if (!validateWithdrawAmount(withdrawAmount)) return;
        if (address) {
            await withdrawAmountAction(withdrawAmount, address, isConnected);
            setWithdrawAmount('');
            setIsWithdrawDialogOpen(false);
        }
    };

    const isSessionActive = enableSessionKey && !!sessionKey;
    // Only show ending animation when actively deleting (not COMPLETED or IDLE)
    const isEndingSession = deletionState !== DeletionState.IDLE && deletionState !== DeletionState.COMPLETED;

    return (
        <div className={cn('ten-connect', resolvedTheme === 'dark' && 'dark')}>
            {!isConnected ? (
                <>
                    <Button
                        onClick={() => setConnectModalOpen(true)}
                        className={cn('tc-bg-primary hover:tc-bg-primary/80', className)}
                        style={style}
                    >
                        Connect Wallet
                    </Button>
                    <ConnectModal
                        isOpen={isConnectModalOpen}
                        onOpenChange={setConnectModalOpen}
                        gatewayUrl={gatewayUrl}
                    />
                </>
            ) : isWrongChain ? (
                <>
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setSettingsModalOpen(true)}
                    >
                        SWITCH CHAIN
                    </Button>
                    <WalletSettingsModal
                        isOpen={isSettingsModalOpen}
                        onOpenChange={setSettingsModalOpen}
                        gatewayUrl={gatewayUrl}
                    />
                </>
            ) : (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    'tc-flex tc-items-center tc-gap-2',
                                    className
                                )}
                                style={style}
                            >
                                <div className="tc-flex tc-flex-col tc-items-start tc-gap-0.5">
                                    <div className="tc-flex tc-items-center tc-gap-2">
                                        {isLoadingEthBalance ? (
                                            <Loader2 className="tc-h-3 tc-w-3 tc-animate-spin" />
                                        ) : (
                                            <span className="tc-text-sm tc-font-medium">
                                                {ethBalance?.formatted?.slice(0, 8) || '0'} ETH
                                            </span>
                                        )}
                                    </div>
                                    {enableSessionKey && (
                                        <div className="tc-flex tc-items-center tc-gap-1.5 tc-text-xs tc-text-muted-foreground">
                                            {isSessionActive ? (
                                                <>
                                                    <span className="tc-flex tc-h-1.5 tc-w-1.5 tc-rounded-full tc-bg-green-500" />
                                                    <span>Session Active</span>
                                                    {sessionBalance && (
                                                        <span className="tc-opacity-70">
                                                            ({isRefreshingBalance ? (
                                                                <Loader2 className="tc-inline tc-h-2 tc-w-2 tc-animate-spin" />
                                                            ) : (
                                                                formatBalance(sessionBalance.eth.toString())
                                                            )} ETH)
                                                        </span>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <span className="tc-flex tc-h-1.5 tc-w-1.5 tc-rounded-full tc-bg-muted-foreground/50" />
                                                    <span>No Session</span>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <ChevronDown className="tc-h-4 tc-w-4 tc-opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="tc-w-56">
                            <DropdownMenuItem
                                onClick={handleOpenWalletInfo}
                                className="tc-cursor-pointer"
                            >
                                <Wallet className="tc-mr-2 tc-h-4 tc-w-4" />
                                <div className="tc-flex tc-flex-col">
                                    <span>Wallet Info</span>
                                    <span className="tc-text-xs tc-text-muted-foreground">
                                        {address?.slice(0, 6)}...{address?.slice(-4)}
                                    </span>
                                </div>
                            </DropdownMenuItem>

                            {enableSessionKey && (
                                <>
                                    <DropdownMenuSeparator />

                                    {isSessionActive ? (
                                        <>
                                            <DropdownMenuItem
                                                onClick={handleOpenSessionKeyManager}
                                                className="tc-cursor-pointer"
                                            >
                                                <Settings className="tc-mr-2 tc-h-4 tc-w-4" />
                                                <span>Session Key Manager</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={handleOpenFundDialog}
                                                disabled={isTransacting}
                                                className="tc-cursor-pointer"
                                            >
                                                <Plus className="tc-mr-2 tc-h-4 tc-w-4" />
                                                <span>Fund Session</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={handleOpenWithdrawDialog}
                                                disabled={isTransacting || getSessionKeyBalance() <= 0.0002}
                                                className="tc-cursor-pointer"
                                            >
                                                <Minus className="tc-mr-2 tc-h-4 tc-w-4" />
                                                <span>Withdraw from Session</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={handleEndSessionClick}
                                                disabled={isEndingSession}
                                                className="tc-cursor-pointer tc-text-destructive focus:tc-text-destructive"
                                            >
                                                {isEndingSession ? (
                                                    <Loader2 className="tc-mr-2 tc-h-4 tc-w-4 tc-animate-spin" />
                                                ) : (
                                                    <Key className="tc-mr-2 tc-h-4 tc-w-4" />
                                                )}
                                                <span>{isEndingSession ? 'Ending Session...' : 'End Session'}</span>
                                            </DropdownMenuItem>
                                        </>
                                    ) : (
                                        <DropdownMenuItem
                                            onClick={handleStartSession}
                                            disabled={isLoading}
                                            className="tc-cursor-pointer"
                                        >
                                            {isLoading ? (
                                                <Loader2 className="tc-mr-2 tc-h-4 tc-w-4 tc-animate-spin" />
                                            ) : (
                                                <Key className="tc-mr-2 tc-h-4 tc-w-4" />
                                            )}
                                            <span>{isLoading ? 'Starting...' : 'Start Session'}</span>
                                        </DropdownMenuItem>
                                    )}
                                </>
                            )}

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                onClick={handleDisconnect}
                                className="tc-cursor-pointer tc-text-destructive focus:tc-text-destructive"
                            >
                                <LogOut className="tc-mr-2 tc-h-4 tc-w-4" />
                                <span>Disconnect</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <WalletSettingsModal
                        isOpen={isSettingsModalOpen}
                        onOpenChange={setSettingsModalOpen}
                        gatewayUrl={gatewayUrl}
                    />
                    
                    {/* SessionKeyManager dialog - controlled via store (only when enabled) */}
                    {enableSessionKey && <SessionKeyManager hideTrigger />}

                    {/* Delete Confirmation Alert Dialog */}
                    <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>End Session?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will first attempt to withdraw any remaining funds back to your
                                    wallet, then permanently delete your session key. You will need to
                                    create a new session key to continue using session-based transactions.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleConfirmDeleteSession}
                                    disabled={isLoading}
                                    className="tc-bg-destructive tc-text-destructive-foreground hover:tc-bg-destructive/90"
                                >
                                    {isLoading && <Loader2 className="tc-mr-2 tc-h-4 tc-w-4 tc-animate-spin" />}
                                    End Session
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    {/* Fund Session Dialog */}
                    <Dialog open={isFundDialogOpen} onOpenChange={setIsFundDialogOpen}>
                        <DialogContent className="tc-max-w-sm">
                            <DialogHeader>
                                <DialogTitle>Fund Session</DialogTitle>
                            </DialogHeader>
                            <div className="tc-space-y-4">
                                <div className="tc-space-y-2">
                                    <Label htmlFor="fundAmount">Amount (ETH)</Label>
                                    <Input
                                        id="fundAmount"
                                        type="number"
                                        step="0.001"
                                        min="0"
                                        value={fundAmount}
                                        onChange={(e) => {
                                            setFundAmount(e.target.value);
                                            validateFundAmount(e.target.value);
                                        }}
                                        placeholder="0.01"
                                        disabled={isTransacting}
                                    />
                                    {fundError && <p className="tc-text-xs tc-text-destructive">{fundError}</p>}
                                </div>
                                <div className="tc-flex tc-gap-2">
                                    <Button
                                        onClick={() => setFundAmountPercentage(25)}
                                        disabled={isTransacting || getWalletBalance() === 0}
                                        variant="outline"
                                        size="sm"
                                        className="tc-flex-1"
                                    >
                                        25%
                                    </Button>
                                    <Button
                                        onClick={() => setFundAmountPercentage(50)}
                                        disabled={isTransacting || getWalletBalance() === 0}
                                        variant="outline"
                                        size="sm"
                                        className="tc-flex-1"
                                    >
                                        50%
                                    </Button>
                                    <Button
                                        onClick={() => setFundAmountPercentage(75)}
                                        disabled={isTransacting || getWalletBalance() === 0}
                                        variant="outline"
                                        size="sm"
                                        className="tc-flex-1"
                                    >
                                        75%
                                    </Button>
                                    <Button
                                        onClick={() => setFundAmountPercentage(100)}
                                        disabled={isTransacting || getWalletBalance() === 0}
                                        variant="outline"
                                        size="sm"
                                        className="tc-flex-1"
                                    >
                                        Max
                                    </Button>
                                </div>
                                <p className="tc-text-xs tc-text-muted-foreground">
                                    Available: {getWalletBalance().toFixed(4)} ETH
                                </p>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsFundDialogOpen(false)}
                                    disabled={isTransacting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleFundSession}
                                    disabled={isTransacting || !fundAmount || !!fundError}
                                >
                                    {isTransacting ? (
                                        <>
                                            <Loader2 className="tc-mr-2 tc-h-4 tc-w-4 tc-animate-spin" />
                                            Funding...
                                        </>
                                    ) : (
                                        'Fund'
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Withdraw Dialog */}
                    <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
                        <DialogContent className="tc-max-w-sm">
                            <DialogHeader>
                                <DialogTitle>Withdraw from Session</DialogTitle>
                            </DialogHeader>
                            <div className="tc-space-y-4">
                                <div className="tc-space-y-2">
                                    <Label htmlFor="withdrawAmount">Amount (ETH)</Label>
                                    <Input
                                        id="withdrawAmount"
                                        type="number"
                                        step="0.001"
                                        min="0"
                                        value={withdrawAmount}
                                        onChange={(e) => {
                                            setWithdrawAmount(e.target.value);
                                            validateWithdrawAmount(e.target.value);
                                        }}
                                        placeholder="0.01"
                                        disabled={isTransacting}
                                    />
                                    {withdrawError && <p className="tc-text-xs tc-text-destructive">{withdrawError}</p>}
                                </div>
                                <div className="tc-flex tc-gap-2">
                                    <Button
                                        onClick={() => setWithdrawAmountPercentage(25)}
                                        disabled={isTransacting || getSessionKeyBalance() <= 0.0002}
                                        variant="outline"
                                        size="sm"
                                        className="tc-flex-1"
                                    >
                                        25%
                                    </Button>
                                    <Button
                                        onClick={() => setWithdrawAmountPercentage(50)}
                                        disabled={isTransacting || getSessionKeyBalance() <= 0.0002}
                                        variant="outline"
                                        size="sm"
                                        className="tc-flex-1"
                                    >
                                        50%
                                    </Button>
                                    <Button
                                        onClick={() => setWithdrawAmountPercentage(75)}
                                        disabled={isTransacting || getSessionKeyBalance() <= 0.0002}
                                        variant="outline"
                                        size="sm"
                                        className="tc-flex-1"
                                    >
                                        75%
                                    </Button>
                                    <Button
                                        onClick={() => setWithdrawAmountPercentage(100)}
                                        disabled={isTransacting || getSessionKeyBalance() <= 0.0002}
                                        variant="outline"
                                        size="sm"
                                        className="tc-flex-1"
                                    >
                                        Max
                                    </Button>
                                </div>
                                <p className="tc-text-xs tc-text-muted-foreground">
                                    Session balance: {getSessionKeyBalance().toFixed(4)} ETH
                                </p>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsWithdrawDialogOpen(false)}
                                    disabled={isTransacting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleWithdrawAmount}
                                    disabled={isTransacting || !withdrawAmount || !!withdrawError}
                                >
                                    {isTransacting ? (
                                        <>
                                            <Loader2 className="tc-mr-2 tc-h-4 tc-w-4 tc-animate-spin" />
                                            Withdrawing...
                                        </>
                                    ) : (
                                        'Withdraw'
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </>
            )}
        </div>
    );
}
