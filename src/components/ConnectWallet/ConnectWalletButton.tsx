import { Button } from '@/components/ui/button';
import { DEFAULT_GATEWAY_URL, TEN_CHAIN_ID } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useAccount, useBalance } from 'wagmi';
import { useEffect, useState } from 'react';
import ConnectModal from './ConnectModal';
import WalletSettingsModal from './WalletSettingsModal';

import { Loader2 } from 'lucide-react';

interface CustomConnectButtonProps {
    className?: string;
    style?: React.CSSProperties;
    onChainChange?: (chainId: number, isCorrect: boolean) => void;
    gatewayUrl?: string;
    onTrackEvent?: (event: string, data: any) => void;
}

export default function ConnectWalletButton({ 
    className,
    style,
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
        <div className="ten-connect">
            {!isConnected ? (
                <>
                    <Button
                        onClick={() => setIsConnectModalOpen(true)}
                        className={cn('tc-bg-primary hover:tc-bg-primary/80', className)}
                        style={style}
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
                            <Button
                                size="sm"
                                className="tc-bg-destructive hover:tc-bg-destructive/90"
                                onClick={() => setIsSettingsOpen(true)}
                            >
                                SWITCH CHAIN
                            </Button>
                    ) : (
                        <Button
                            className={cn('tc-bg-primary hover:tc-bg-primary/90 tc-flex tc-flex-col tc-items-center tc-justify-center lg:tc-py-2 tc-gap-0', className)}
                            style={style}
                            onClick={() => setIsSettingsOpen(true)}
                        >
                            <span className="tc-text-xs">
                                {address?.slice(0, 6)}...{address?.slice(-4)}
                            </span>
                            <div className="tc-hidden md:tc-flex tc-gap-2 tc-items-center tc-text-xs tc-text-primary-foreground/80">
                                {isLoadingEthBalance ? (
                                    <Loader2 className="tc-h-3 tc-w-3 tc-animate-spin" />
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
    );
}
