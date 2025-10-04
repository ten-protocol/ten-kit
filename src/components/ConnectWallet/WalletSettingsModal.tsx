import { Button } from '@/components/ui/button';
import { DEFAULT_GATEWAY_URL, TEN_CHAIN_ID } from '@/lib/constants';
import { ExternalLink } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAccount, useDisconnect, useSwitchChain, useBalance } from 'wagmi';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';

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
    const { address, chain, connector } = useAccount();
    const { disconnect } = useDisconnect();
    const { isPending: isSwitchingChain, error: switchChainError } = useSwitchChain();
    const [chainExists, setChainExists] = useState<boolean | null>(null);
    const [isCheckingChain, setIsCheckingChain] = useState(false);

    const { data: ethBalance, isLoading: isLoadingEthBalance } = useBalance({
        address,
        chainId: TEN_CHAIN_ID,
    });

    const isWrongChain = !chain || Number(chain.id) !== Number(TEN_CHAIN_ID);

    useEffect(() => {
        const checkChainExists = async () => {
            if (!isOpen || !isWrongChain || !connector) {
                return;
            }

            setIsCheckingChain(true);
            setChainExists(null);

            try {
                const provider = await connector.getProvider() as any;
                
                if (!provider || typeof provider.request !== 'function') {
                    setIsCheckingChain(false);
                    return;
                }

                await provider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: `0x${TEN_CHAIN_ID.toString(16)}` }],
                });
                
                setChainExists(true);
            } catch (error: any) {
                // Error code 4902 means the chain has not been added
                if (error.code === 4902) {
                    setChainExists(false);
                } else if (error.code === 4001) {
                    // User rejected, but chain exists
                    setChainExists(true);
                } else {
                    setChainExists(false);
                }
            } finally {
                setIsCheckingChain(false);
            }
        };

        checkChainExists();
    }, [isOpen, isWrongChain, connector]);

    const handleSwitchChain = async () => {
        if (!connector) {
            console.error('No connector available');
            return;
        }

        try {
            const provider = await connector.getProvider() as any;
            
            if (!provider || typeof provider.request !== 'function') {
                console.error('Provider does not support request method');
                return;
            }

            await provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${TEN_CHAIN_ID.toString(16)}` }],
            });

        } catch (error: any) {
            console.error('Switch chain error:', error);
            
            // Error code 4902 means the chain has not been added to the wallet
            if (error.code === 4902) {
                const message = 'TEN Protocol has not been added to your wallet yet. Please add it first via the TEN Gateway.';
                
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
                return;
            }
            
            // Error code 4001 means user rejected the request
            if (error.code === 4001) {
                console.log('User rejected the switch chain request');
                return;
            }

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
                                {isCheckingChain ? (
                                    <Alert>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <AlertTitle>Checking network...</AlertTitle>
                                        <AlertDescription>
                                            Verifying if TEN Protocol is available in your wallet.
                                        </AlertDescription>
                                    </Alert>
                                ) : chainExists === false ? (
                                    <>
                                        <Alert variant="destructive">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertTitle>Chain not found in wallet.</AlertTitle>
                                            <AlertDescription>
                                                Before you can use dApps on TEN Protocol you first have to add the chain to your wallet via the TEN Gateway.
                                            </AlertDescription>
                                            <Button asChild className="w-full mt-4">
                                                <a href={gatewayUrl} target="_blank" rel="noopener noreferrer">
                                                    Add TEN via Gateway{' '}
                                                    <ExternalLink className="ml-2 w-4 h-4" />
                                                </a>
                                            </Button>
                                        </Alert>

                                    </>
                                ) : chainExists === true ? (
                                    <>
                                        <Alert variant="destructive">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertTitle>Wrong Network</AlertTitle>
                                            <AlertDescription>
                                                You are on the wrong network. Click below to switch to TEN Protocol.
                                            </AlertDescription>
                                        </Alert>
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
                                    </>
                                ) : (
                                    <>
                                        <Alert variant="destructive">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertTitle>Wrong Network</AlertTitle>
                                            <AlertDescription>
                                                You are on the wrong network. Please make sure you have added TEN Protocol to your wallet via the TEN Gateway.
                                            </AlertDescription>
                                        </Alert>
                                        <Button asChild variant="outline" className="w-full">
                                            <a href={gatewayUrl} target="_blank" rel="noopener noreferrer">
                                                Add TEN to Wallet (Gateway){' '}
                                                <ExternalLink className="ml-2 w-4 h-4" />
                                            </a>
                                        </Button>
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
                                    </>
                                )}
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
