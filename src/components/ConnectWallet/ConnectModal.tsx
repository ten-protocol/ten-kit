import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { AlertCircle } from 'lucide-react';
import {Connector, useConnect, useConnectors} from 'wagmi';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExternalLink } from 'lucide-react';
import { DEFAULT_GATEWAY_URL } from '@/lib/constants';
import {supportedWallets} from "@/lib/supportedWallets";
import {useMemo} from "react";
import ConnectWalletListItem from "@/components/ConnectWallet/ConnectWalletListItem";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import SupportedWallets from "@/components/ConnectWallet/SupportedWallets";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    gatewayUrl?: string;
};

export default function ConnectModal({ isOpen, onOpenChange, gatewayUrl = DEFAULT_GATEWAY_URL }: Props) {
    const { connect, isPending } = useConnect();
    const connectors = useConnectors();

    const usableWallets: Connector[] = [];
    const unsupportedWallets: Connector[] = [];

    connectors.forEach((connector) => {
        const matchingSupportedWallet = supportedWallets.find(
            (wallet) => wallet.name === connector.name
        );

        if (matchingSupportedWallet) {
            usableWallets.push(connector);
        } else {
            unsupportedWallets.push(connector);
        }
    });

    const unsupportedWalletList = useMemo(
        () =>
            unsupportedWallets
                .filter((connector) => connector.icon)
                .map((connector) => {
                    return (
                        <ConnectWalletListItem
                            key={connector.id}
                            onClick={() => {}}
                            connector={connector}
                            supported={false}
                        />
                    );
                }),
        [connectors]
    );

    const usableWalletList = useMemo(
        () =>
            usableWallets.map((connector) => {
                return (
                    <ConnectWalletListItem
                        key={connector.id}
                        onClick={() => {
                            connect({ connector });
                        }}
                        connector={connector}
                        supported={true}
                    />
                );
            }),
        [connectors]
    );

    const WalletList = () => {
        return (
            <div className="grid gap-4 py-4">
                {usableWalletList.length === 0 ? (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center">
                                You have no wallets compatible with TEN Protocol.
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <SupportedWallets />
                        </CardContent>
                    </Card>
                ) : (
                    <div className="flex flex-col gap-4">
                        {usableWalletList.length > 0 && <h4>Your Supported Wallets</h4>}
                        {usableWalletList}
                    </div>
                )}

                {unsupportedWalletList.length > 0 && <h4>Your Unsupported Wallets</h4>}
                {unsupportedWalletList}
            </div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Connect Wallet</DialogTitle>
                    <DialogDescription>
                        Choose a wallet to connect to TEN Protocol
                    </DialogDescription>
                </DialogHeader>

                <Alert variant="default" className="mt-2 border-white/50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Heads up!</AlertTitle>
                    <AlertDescription>
                        Before being able to connect to TEN Protocol for the first time, you&#39;ll
                        need to visit the{' '}
                        <a href={gatewayUrl} target="_blank" rel="noopener noreferrer">
                            <span className="inline-flex gap-1 justify-center items-center text-bold hover:underline">
                                TEN Gateway <ExternalLink className="w-3 h-3" />
                            </span>
                        </a>{' '}
                        beforehand to get onboarded onto the network.
                        <Button asChild variant="outline" className="w-full mt-2 self-center">
                            <a href={gatewayUrl} target="_blank" rel="noopener noreferrer">
                                Visit TEN Gateway <ExternalLink className="ml-2 w-4 h-4" />
                            </a>
                        </Button>
                    </AlertDescription>
                </Alert>

                <div className="grid gap-4 py-4">
                    <WalletList />
                </div>
            </DialogContent>
        </Dialog>
    );
}
