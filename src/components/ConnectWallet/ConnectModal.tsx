
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { AlertCircle, Loader2, Wallet } from 'lucide-react';
import { useConnect, useConnectors } from 'wagmi';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExternalLink } from 'lucide-react';
import { DEFAULT_GATEWAY_URL } from '@/lib/constants';

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    gatewayUrl?: string;
};

export default function ConnectModal({ isOpen, onOpenChange, gatewayUrl = DEFAULT_GATEWAY_URL }: Props) {
    const { connect, isPending } = useConnect();
    const connectors = useConnectors();

    const uniqueConnectors = connectors.filter(
        (connector, index, self) => index === self.findIndex((c) => c.name === connector.name)
    );

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
                    {uniqueConnectors
                        .filter((connector) => connector.name !== 'Injected')
                        .map((connector) => (
                            <Button
                                key={connector.uid}
                                variant="outline"
                                className="w-full justify-start gap-4 h-14"
                                onClick={() => {
                                    connect({ connector });
                                }}
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : connector.icon ? (
                                    <img
                                        src={connector.icon}
                                        width={32}
                                        height={32}
                                        alt={connector.name}
                                    />
                                ) : (
                                    <Wallet className="h-6 w-6" />
                                )}
                                <div className="flex flex-col items-start">
                                    <span className="font-medium">
                                        {connector.name === 'Injected'
                                            ? 'Browser Wallet'
                                            : connector.name}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        {connector.type === 'injected'
                                            ? 'Browser Extension'
                                            : connector.type}
                                    </span>
                                </div>
                            </Button>
                        ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
