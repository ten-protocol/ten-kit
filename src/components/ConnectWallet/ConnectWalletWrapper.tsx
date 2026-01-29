import { ReactNode } from 'react';
import { useAccount } from 'wagmi';
import { DEFAULT_GATEWAY_URL, TEN_CHAIN_ID } from '@/lib/constants';
import ConnectWalletButton from './ConnectWalletButton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';
import { useThemeStore } from '@/stores/theme.store';

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
    const resolvedTheme = useThemeStore((state) => state.resolvedTheme);
    const themeClass = resolvedTheme === 'dark' ? 'dark' : '';

    const containerClasses = cn('', {
        'tc-opacity-50 tc-pointer-events-none': loading,
    });

    if (showContent && errorState) {
        return (
            <div className={cn('ten-connect tc-flex tc-flex-col tc-gap-2 tc-my-6 tc-text-center tc-items-center', themeClass)}>
                <h3 className="tc-text-xl">Error fetching contract data</h3>
                <p className="tc-mb-4 tc-opacity-90">
                    This may be because your access token has been revoked or has expired (this will
                    only happen on Testnet). Please visit the TEN Gateway to request new access
                    tokens.
                </p>
                <Button asChild variant="outline">
                    <a href={gatewayUrl} target="_blank" rel="noopener noreferrer">
                        VISIT TEN GATEWAY <ExternalLink className="tc-w-4 tc-h-4" />
                    </a>
                </Button>
            </div>
        );
    }

    if (showContent) {
        return (
            <div className={cn('ten-connect', themeClass, containerClasses)}>
                {children}
                {loading && (
                    <div className="tc-h-[3px] tc-my-[25px] tc-overflow-hidden tc-relative">
                        <div className="timer" />
                    </div>
                )}
            </div>
        );
    }

    return (
        <div
            className={cn(
                'ten-connect tc-flex tc-flex-col tc-items-center tc-justify-center tc-gap-4 tc-p-4 tc-text-center',
                themeClass,
                className
            )}
        >
            <div>
                <p>Visit TEN Gateway to connect to TEN Protocol.</p>
                <p className="tc-text-sm tc-opacity-70 tc-mb-4">
                    (Only required if you&apos;ve not already connected to the gateway)
                </p>
                <Button asChild variant="outline">
                    <a href={gatewayUrl} target="_blank" rel="noopener noreferrer">
                        TEN GATEWAY <ExternalLink className="tc-w-4 tc-h-4" />
                    </a>
                </Button>
            </div>

            <p className="tc-text-center tc-text-sm tc-mb-2">
                Otherwise please connect your wallet to access this content
            </p>
            <ConnectWalletButton gatewayUrl={gatewayUrl} />
        </div>
    );
}
