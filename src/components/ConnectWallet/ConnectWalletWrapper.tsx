import { ReactNode } from 'react';
import { useAccount } from 'wagmi';
import { DEFAULT_GATEWAY_URL, TEN_CHAIN_ID } from '@/lib/constants';
import ConnectWalletButton from './ConnectWalletButton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';

interface ConnectWalletProps {
    children: ReactNode;
    className?: string;
    errorState?: boolean;
    loading: boolean;
    gatewayUrl?: string;
}

export default function ConnectWalletWrapper({
    children,
    className,
    errorState,
    loading,
    gatewayUrl = DEFAULT_GATEWAY_URL,
}: ConnectWalletProps) {
    const { isConnected, chainId } = useAccount();
    const isCorrectChain = chainId === TEN_CHAIN_ID;
    const showContent = isConnected && isCorrectChain;

    const containerClasses = cn('', {
        'opacity-50 pointer-events-none': loading,
    });

    if (showContent && errorState) {
        return (
            <div className="flex flex-col gap-2 my-6 text-center items-center">
                <h3 className="text-xl">Error fetching contract data</h3>
                <p className="mb-4 opacity-90">
                    This may be because your access token has been revoked or has expired (this will
                    only happen on Testnet). Please visit the TEN Gateway to request new access
                    tokens.
                </p>
                <Button asChild variant="outline">
                    <a href={gatewayUrl} target="_blank" rel="noopener noreferrer">
                        VISIT TEN GATEWAY <ExternalLink className="w-4 h-4" />
                    </a>
                </Button>
            </div>
        );
    }

    if (showContent) {
        return (
            <div className={containerClasses}>
                {children}
                {loading && (
                    <div className="h-[3px] my-[25px] overflow-hidden relative">
                        <div className="timer" />
                    </div>
                )}
            </div>
        );
    }

    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center gap-4 p-4 text-center',
                className
            )}
        >
            <div>
                <p>Visit TEN Gateway to connect to TEN Protocol.</p>
                <p className="text-sm opacity-70 mb-4">
                    (Only required if you&apos;ve not already connected to the gateway)
                </p>
                <Button asChild variant="outline">
                    <a href={gatewayUrl} target="_blank" rel="noopener noreferrer">
                        TEN GATEWAY <ExternalLink className="w-4 h-4" />
                    </a>
                </Button>
            </div>

            <p className="text-center text-sm mb-2">
                Otherwise please connect your wallet to access this content
            </p>
            <ConnectWalletButton gatewayUrl={gatewayUrl} />
        </div>
    );
}
