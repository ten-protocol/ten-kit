import { useAccount, useBalance } from 'wagmi';
import { Address } from 'viem';
import { Button } from '../ui/button';
import { AlertCircle, Copy } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { ExternalLink } from 'lucide-react';

type Props = {
    insufficientBalance?: boolean;
    zenContractAddress?: string;
    onAddedTokenChange?: (hasAdded: boolean) => void;
};

export default function ZenToken({ 
    insufficientBalance, 
    zenContractAddress,
    onAddedTokenChange 
}: Props) {
    const { address, connector } = useAccount();
    const [hasAddedToken, setHasAddedToken] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        // Load from localStorage if available
        if (typeof window !== 'undefined' && address) {
            const stored = localStorage.getItem('ADDED_ZEN_TOKEN_' + address);
            setHasAddedToken(stored === 'true');
        }
    }, [address]);

    useEffect(() => {
        if (onAddedTokenChange) {
            onAddedTokenChange(hasAddedToken);
        }
    }, [hasAddedToken, onAddedTokenChange]);

    const { data: zenBalance, refetch: zenRefetch } = useBalance({
        address,
        token: zenContractAddress as Address,
        query: {
            enabled: !!zenContractAddress && !!address,
        },
    });

    const handleAddToken = async () => {
        if (!connector || !address || !zenContractAddress) return;

        try {
            const provider = await connector.getProvider() as any;

            const wasAdded = await provider.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address: zenContractAddress,
                        symbol: 'ZEN',
                        decimals: 18,
                    },
                },
            });

            if (wasAdded) {
                setHasAddedToken(true);
                if (typeof window !== 'undefined') {
                    localStorage.setItem('ADDED_ZEN_TOKEN_' + address, 'true');
                }
                zenRefetch();
            }
        } catch (error) {
            console.error('Failed to add token to wallet:', error);
        }
    };

    const showAddTokenCTA =
        address && zenBalance && Number(zenBalance.formatted) === 0 && !hasAddedToken && zenContractAddress;

    const shortenAddress = (address: string): string => {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const copyAddressToClipboard = () => {
        if (zenContractAddress && typeof navigator !== 'undefined') {
            navigator.clipboard.writeText(zenContractAddress);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!isClient || (!showAddTokenCTA && !insufficientBalance)) return null;

    if (showAddTokenCTA) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Add ZEN</AlertTitle>
                <AlertDescription>
                    <p className="text-sm">
                        To see the token balance in your wallet you&#39;ll need to import the token.
                    </p>
                </AlertDescription>
                <div className="mt-2 flex flex-col items-center gap-2">
                    <div className="flex items-center justify-center gap-2">
                        <Button
                            onClick={handleAddToken}
                            size="sm"
                            variant="outline"
                            className="mt-2"
                        >
                            {zenContractAddress && shortenAddress(zenContractAddress)}
                        </Button>
                        <button
                            onClick={copyAddressToClipboard}
                            className="text-xs flex items-center p-1 hover:bg-muted rounded"
                            title="Copy full address to clipboard"
                            aria-label="Copy contract address"
                        >
                            <Copy size={14} />
                            {copied && <span className="ml-1 text-white/60">Copied!</span>}
                        </button>
                    </div>
                </div>
            </Alert>
        );
    }

    return (
        <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Insufficient funds to play</AlertTitle>
            <AlertDescription>
                Visit the{' '}
                <a
                    href="https://faucet.ten.xyz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-bold inline-flex gap-x-1 items-center text-white/80 hover:text-white"
                >
                    TEN Faucet
                    <ExternalLink className="w-3 h-3" />
                </a>{' '}
                to top-up your wallet balance.
            </AlertDescription>
        </Alert>
    );
}
