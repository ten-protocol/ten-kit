
import { Button } from '../ui/button';
import { DEFAULT_GATEWAY_URL, TEN_CHAIN_ID } from '../../lib/constants';
import { ExternalLink } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useAccount, useDisconnect, useSwitchChain, useBalance } from 'wagmi';
import { Skeleton } from '../ui/skeleton';

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    gatewayUrl?: string;
    onToast?: (message: string, options?: any) => void;
};

export default function WalletSettingsModal({ 
    isOpen, 
    onOpenChange, 
    gatewayUrl = DEFAULT_GATEWAY_URL,
    onToast 
}: Props) {
    const { address, chain } = useAccount();
    const { disconnect } = useDisconnect();
    const { switchChain, isPending: isSwitchingChain, error: switchChainError } = useSwitchChain();

    const { data: ethBalance, isLoading: isLoadingEthBalance } = useBalance({
        address,
        chainId: TEN_CHAIN_ID,
    });

    const isWrongChain = !chain || Number(chain.id) !== Number(TEN_CHAIN_ID);

    const handleSwitchChain = async () => {
        try {
            await switchChain({ chainId: TEN_CHAIN_ID });
        } catch (error) {
            console.error('Failed to switch chain:', error);
            const message = 'Failed to switch to TEN Protocol. Please make sure you have added TEN Protocol to your wallet.';
            
            if (onToast) {
                onToast(message, {
                    duration: 5000,
                    action: {
                        label: 'Visit TEN Gateway',
                        onClick: () => window.open(gatewayUrl, '_blank'),
                    },
                });
            } else {
                alert(message);
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Wallet Settings</DialogTitle>
                    <DialogDescription>
                        Manage your wallet connection and network settings
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h4 className="font-medium">Current Network</h4>
                        <p className="text-sm text-muted-foreground">
                            {chain?.name || 'Unknown Network'} (ID: {chain?.id})
                        </p>
                        {isWrongChain && (
                            <div className="space-y-2">
                                <p className="text-sm text-destructive">
                                    You are on the wrong network. Please switch to TEN Protocol.
                                </p>
                                {switchChainError && (
                                    <Alert variant="destructive" className="mt-2">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Failed to switch network.</AlertTitle>
                                        <AlertDescription>
                                            Please make sure you have added TEN Protocol to your
                                            wallet. Visit the{' '}
                                            <a href={gatewayUrl} target="_blank" rel="noopener noreferrer">
                                                <span className="inline-flex gap-1 justify-center items-center hover:underline text-bold text-white/80 hover:text-white">
                                                    TEN Gateway <ExternalLink className="w-3 h-3" />
                                                </span>
                                            </a>{' '}
                                            to get onboarded onto the network.
                                        </AlertDescription>
                                    </Alert>
                                )}
                                {switchChainError && (
                                    <Button asChild variant="outline" className="w-full mt-2">
                                        <a href={gatewayUrl} target="_blank" rel="noopener noreferrer">
                                            Visit TEN Gateway{' '}
                                            <ExternalLink className="ml-2 w-4 h-4" />
                                        </a>
                                    </Button>
                                )}
                                <Button
                                    onClick={handleSwitchChain}
                                    className="w-full"
                                    disabled={isSwitchingChain}
                                >
                                    {isSwitchingChain ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Switching...
                                        </>
                                    ) : (
                                        'Switch to TEN Protocol'
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-medium">Connected Account</h4>
                        <p className="text-sm text-muted-foreground break-all">{address}</p>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-medium">Balances</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span>ETH:</span>
                                {isLoadingEthBalance ? (
                                    <Skeleton className="w-24 h-5" />
                                ) : (
                                    <span className="font-medium">
                                        {ethBalance?.formatted || '0'} {ethBalance?.symbol || 'ETH'}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button
                            onClick={() => {
                                disconnect();
                                onOpenChange(false);
                            }}
                            variant="destructive"
                            className="w-full"
                        >
                            Disconnect Wallet
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
