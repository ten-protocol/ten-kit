import React, { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSessionKeyManagerStore } from '@/stores/sessionKeyManager.store';
import { useSessionKeyStore } from '@/stores/sessionKey.store';

export default function SessionKeyFunding() {
    const { address, isConnected, connector } = useAccount();
    const { startSession, fundSession, withdrawAmountAction, isTransacting } =
        useSessionKeyManagerStore();
    const { balance, sessionKey, isLoading } = useSessionKeyStore();

    // Get wallet balance
    const { data: walletBalance } = useBalance({
        address,
    });

    const [activeTab, setActiveTab] = useState<'fund' | 'withdraw'>('fund');
    const [fundAmount, setFundAmount] = useState<string>('');
    const [withdrawAmount, setWithdrawAmount] = useState<string>('');
    const [withdrawAddress, setWithdrawAddress] = useState<string>('');
    const [fundError, setFundError] = useState<string>('');
    const [withdrawError, setWithdrawError] = useState<string>('');
    const [withdrawAddressError, setWithdrawAddressError] = useState<string>('');

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
            const gasReserve = 0.001; // Reserve 0.001 ETH for gas
            const maxAvailable = walletBalanceNum - gasReserve;

            if (numAmount > maxAvailable) {
                setFundError(
                    `Amount exceeds available balance (reserves ${gasReserve} ETH for gas)`
                );
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

        const sessionKeyBalance = parseFloat(balance?.eth?.toString() || '0');
        const gasReserve = 0.0002; // Reserve 0.0002 ETH for gas (session key gas reserve)
        const maxAvailable = sessionKeyBalance - gasReserve;

        if (numAmount > maxAvailable) {
            setWithdrawError(
                `Amount exceeds available balance (reserves ${gasReserve} ETH for gas)`
            );
            return false;
        }

        setWithdrawError('');
        return true;
    };

    const validateWithdrawAddress = (addr: string) => {
        if (!addr || addr === '') {
            setWithdrawAddressError('');
            return true; // Optional field, empty is valid
        }

        // Basic Ethereum address validation (0x followed by 40 hex characters)
        const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
        if (!ethAddressRegex.test(addr)) {
            setWithdrawAddressError('Invalid Ethereum address');
            return false;
        }

        setWithdrawAddressError('');
        return true;
    };

    // Validate amounts when they change
    useEffect(() => {
        validateFundAmount(fundAmount);
    }, [fundAmount, walletBalance]);

    useEffect(() => {
        validateWithdrawAmount(withdrawAmount);
    }, [withdrawAmount, balance]);

    useEffect(() => {
        validateWithdrawAddress(withdrawAddress);
    }, [withdrawAddress]);

    // Helper functions for quick transfer buttons
    const getWalletBalance = () => {
        return walletBalance ? parseFloat(walletBalance.formatted) : 0;
    };

    const getSessionKeyBalance = () => {
        return parseFloat(balance?.eth?.toString() || '0');
    };

    const setFundAmountPercentage = (percentage: number) => {
        const balance = getWalletBalance();
        // Reserve 0.001 ETH for gas fees
        const gasReserve = 0.001;
        const availableBalance = Math.max(0, balance - gasReserve);
        const amount = Math.floor(((availableBalance * percentage) / 100) * 1000) / 1000; // Round down to 3 decimals
        setFundAmount(amount.toFixed(3));
    };

    const setWithdrawAmountPercentage = (percentage: number) => {
        const balance = getSessionKeyBalance();
        // Reserve 0.0002 ETH for gas fees (session key gas reserve)
        const gasReserve = 0.0002;
        const availableBalance = Math.max(0, balance - gasReserve);
        const amount = Math.floor(((availableBalance * percentage) / 100) * 1000) / 1000; // Round down to 3 decimals
        setWithdrawAmount(amount.toFixed(3));
    };

    const handleStartSession = async () => {
        const provider = await connector?.getProvider();
        if (provider) {
            await startSession(isConnected);
        }
    };

    const handleFundSession = async () => {
        if (!validateFundAmount(fundAmount)) return;

        const provider = await connector?.getProvider();
        if (provider && address) {
            await fundSession(fundAmount, address, isConnected);
            setFundAmount('');
        }
    };

    const handleWithdrawAmount = async () => {
        if (!validateWithdrawAmount(withdrawAmount)) return;
        if (!validateWithdrawAddress(withdrawAddress)) return;

        const provider = await connector?.getProvider();
        if (provider && address) {
            // Use custom address if provided, otherwise use connected wallet address
            const targetAddress = withdrawAddress || address;
            await withdrawAmountAction(withdrawAmount, targetAddress, isConnected);
            setWithdrawAmount('');
            setWithdrawAddress('');
        }
    };

    // Start Session
    if (!sessionKey) {
        return (
            <Button onClick={handleStartSession} disabled={isLoading} className="w-full" size="lg">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Start Session
            </Button>
        );
    }

    // Fund/withdraw Session
    return (
        <div className="w-full">
            {/* Tab Navigation */}
            <div className="flex bg-muted rounded-lg p-1 mb-4">
                <button
                    onClick={() => setActiveTab('fund')}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === 'fund'
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    Fund
                </button>
                <button
                    onClick={() => setActiveTab('withdraw')}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === 'withdraw'
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    Withdraw
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'fund' && (
                <div className="space-y-2">
                    <Label htmlFor="fundAmount">Fund Session</Label>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="flex-1 col-span-3">
                        <Input
                            id="fundAmount"
                            type="number"
                            step="0.001"
                            min="0"
                            value={fundAmount}
                            onChange={(e) => setFundAmount(e.target.value)}
                            placeholder="0.01"
                            className="mb-2"
                            disabled={isTransacting}
                        />
                            {/* Quick transfer buttons */}
                            <div className="flex gap-1">
                                <Button
                                    onClick={() => setFundAmountPercentage(25)}
                                    disabled={isTransacting || getWalletBalance() === 0}
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 text-xs"
                                >
                                    25%
                                </Button>
                                <Button
                                    onClick={() => setFundAmountPercentage(50)}
                                    disabled={isTransacting || getWalletBalance() === 0}
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 text-xs"
                                >
                                    50%
                                </Button>
                                <Button
                                    onClick={() => setFundAmountPercentage(75)}
                                    disabled={isTransacting || getWalletBalance() === 0}
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 text-xs"
                                >
                                    75%
                                </Button>
                                <Button
                                    onClick={() => setFundAmountPercentage(100)}
                                    disabled={isTransacting || getWalletBalance() === 0}
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 text-xs"
                                >
                                    100%
                                </Button>
                            </div>
                        </div>
                        <Button
                            onClick={handleFundSession}
                            disabled={isTransacting || !fundAmount || !!fundError}
                            variant="secondary"
                            className="col-span-1"
                        >
                            {isTransacting ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                'Fund'
                            )}
                        </Button>
                    </div>

                    {fundError && <p className="text-xs text-red-400 absolute">{fundError}</p>}
                </div>
            )}

            {activeTab === 'withdraw' && (
                <div className="space-y-2">
                    <Label htmlFor="withdrawAmount">Withdraw From Session</Label>
                    <div className="space-y-2">
                        <Input
                            id="withdrawAddress"
                            type="text"
                            value={withdrawAddress}
                            onChange={(e) => setWithdrawAddress(e.target.value)}
                            placeholder="Recipient address (optional, defaults to your wallet)"
                            className="w-full"
                            disabled={isTransacting}
                        />
                        {withdrawAddressError && (
                            <p className="text-xs text-red-400">{withdrawAddressError}</p>
                        )}
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="flex-1 col-span-3">
                        <Input
                            id="withdrawAmount"
                            type="number"
                            step="0.001"
                            min="0"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            placeholder="0.01"
                            className="mb-2"
                            disabled={isTransacting}
                        />
                            {/* Quick transfer buttons */}
                            <div className="flex gap-1">
                                <Button
                                    onClick={() => setWithdrawAmountPercentage(25)}
                                    disabled={isTransacting || getSessionKeyBalance() === 0}
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 text-xs"
                                >
                                    25%
                                </Button>
                                <Button
                                    onClick={() => setWithdrawAmountPercentage(50)}
                                    disabled={isTransacting || getSessionKeyBalance() === 0}
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 text-xs"
                                >
                                    50%
                                </Button>
                                <Button
                                    onClick={() => setWithdrawAmountPercentage(75)}
                                    disabled={isTransacting || getSessionKeyBalance() === 0}
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 text-xs"
                                >
                                    75%
                                </Button>
                                <Button
                                    onClick={() => setWithdrawAmountPercentage(100)}
                                    disabled={isTransacting || getSessionKeyBalance() === 0}
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 text-xs"
                                >
                                    100%
                                </Button>
                            </div>
                        </div>
                        <Button
                            onClick={handleWithdrawAmount}
                            disabled={
                                isTransacting ||
                                !withdrawAmount ||
                                !!withdrawError ||
                                !!withdrawAddressError
                            }
                            variant="secondary"
                            className="col-span-1"
                        >
                            {isTransacting ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                'Withdraw'
                            )}
                        </Button>
                    </div>
                    {withdrawError && (
                        <p className="text-xs text-red-400 absolute">{withdrawError}</p>
                    )}
                </div>
            )}
        </div>
    );
}
