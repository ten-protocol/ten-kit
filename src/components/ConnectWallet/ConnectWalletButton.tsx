import { Button } from '@/components/ui/button';
import { DEFAULT_GATEWAY_URL, TEN_CHAIN_ID } from '@/lib/constants';
import { useAccount, useBalance } from 'wagmi';
import { useEffect, useState } from 'react';
import ConnectModal from './ConnectModal';
import WalletSettingsModal from './WalletSettingsModal';

import { Loader2 } from 'lucide-react';

interface CustomConnectButtonProps {
    className?: string;
    onChainChange?: (chainId: number, isCorrect: boolean) => void;
    gatewayUrl?: string;
    onTrackEvent?: (event: string, data: any) => void;
}

export default function ConnectWalletButton({ 
    className, 
    onChainChange,
    gatewayUrl = DEFAULT_GATEWAY_URL,
    onTrackEvent
}: CustomConnectButtonProps) {
    const { address, isConnected, chain } = useAccount();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

    const isWrongChain = !chain || Number(chain.id) !== Number(TEN_CHAIN_ID);

    const { data: ethBalance, isLoading: isLoadingEthBalance } = useBalance({
        address,
        chainId: TEN_CHAIN_ID,
        query: {
            enabled: isConnected && !isWrongChain,
        },
    });

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

    return (
        <div className={`w-full max-w-md flex justify-center ${className || ''}`}>
            <div className="w-full flex justify-end">
                {!isConnected ? (
                    <>
                        <Button
                            onClick={() => setIsConnectModalOpen(true)}
                            className="bg-primary hover:bg-primary/90"
                        >
                            Connect Wallet
                        </Button>
                        <ConnectModal
                            isOpen={isConnectModalOpen}
                            onOpenChange={setIsConnectModalOpen}
                            gatewayUrl={gatewayUrl}
                        />
                    </>
                ) : (
                    <>
                        {isWrongChain ? (
                            <div className="flex gap-2 items-start">
                                <Button
                                    size="sm"
                                    className="bg-destructive hover:bg-destructive/90"
                                    onClick={() => setIsSettingsOpen(true)}
                                >
                                    SWITCH CHAIN
                                </Button>
                            </div>
                        ) : (
                            <Button
                                className="bg-primary hover:bg-primary/90 flex flex-col items-center justify-center lg:py-2 gap-0"
                                onClick={() => setIsSettingsOpen(true)}
                            >
                                <span className="text-xs">
                                    {address?.slice(0, 6)}...{address?.slice(-4)}
                                </span>
                                <div className="hidden md:flex gap-2 items-center text-xs text-primary-foreground/80">
                                    {isLoadingEthBalance ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : (
                                        <span>
                                            {ethBalance?.formatted?.slice(0, 6) || '0'}{' '}
                                            {ethBalance?.symbol}
                                        </span>
                                    )}
                                </div>
                            </Button>
                        )}
                        <WalletSettingsModal
                            isOpen={isSettingsOpen}
                            onOpenChange={setIsSettingsOpen}
                            gatewayUrl={gatewayUrl}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
