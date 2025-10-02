import React, { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Loader2, AlertCircle, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog';
import { formatBalance } from '@/lib/utils';
import { DeletionState, useSessionKeyManagerStore } from '@/stores/sessionKeyManager.store';
import { useState } from 'react';
import SessionKeyInfo from './SessionKeyInfo';
import SessionKeyFunding from './SessionKeyFunding';
import SessionKeyTrash from './SessionKeyTrash';
import SessionKeyTrashProgress from './SessionKeyTrashProgress';
import { useSessionKeyStore } from '@/stores/sessionKey.store';

export default function SessionKeyManager() {
    const { isConnected, connector } = useAccount();
    const { sessionKey, isLoading, error, balance } = useSessionKeyStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { deletionState, isRefreshingBalance, updateSessionKeyBalance } =
        useSessionKeyManagerStore();

    console.log(balance);

    useEffect(() => {
        if (sessionKey && connector) {
            updateSessionKeyBalance(sessionKey, connector.provider);
        }
    }, [sessionKey, connector, updateSessionKeyBalance]);

    // Handle dialog open/close
    const handleDialogOpenChange = (open: boolean) => {
        setIsDialogOpen(open);
        // Clear any errors when closing the dialog
        if (!open) {
            if (error) {
                // Clear error state if needed
            }
        }
    };

    // Render trigger button
    const renderTriggerButton = () => {
        if (!isConnected) {
            return null;
        }

        if (!sessionKey) {
            return (
                <Button variant="outline">
                    <Key className="mr-2 h-4 w-4" />
                    Start Session
                </Button>
            );
        }

        return (
            <Button variant="outline" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                <div className="flex items-center gap-2">
                    <span className="hidden md:inline">Session Key</span>
                    {balance && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            {isRefreshingBalance ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                            ) : null}
                            {formatBalance(balance.eth.toString())} ETH
                        </span>
                    )}
                </div>
            </Button>
        );
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>{renderTriggerButton()}</DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Session Key Manager</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error.message}</AlertDescription>
                        </Alert>
                    )}

                    {isLoading && (
                        <Alert>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <AlertTitle>Processing</AlertTitle>
                            <AlertDescription>
                                Please wait while we process your request...
                            </AlertDescription>
                        </Alert>
                    )}

                    {deletionState === DeletionState.IDLE && (
                        <div className="space-y-4">
                            <SessionKeyInfo />
                            <SessionKeyFunding />
                            <SessionKeyTrash />
                        </div>
                    )}
                    {deletionState !== DeletionState.IDLE && <SessionKeyTrashProgress />}
                </div>
            </DialogContent>
        </Dialog>
    );
}
