import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSessionKeyManagerStore } from '@/stores/sessionKeyManager.store';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useSessionKeyStore } from '@/stores/sessionKey.store';

export default function SessionKeyTrash() {
    const { address, isConnected, connector } = useAccount();
    const { sessionKey, isLoading } = useSessionKeyStore();
    const { confirmDeleteSession } = useSessionKeyManagerStore();
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

    const handleDeleteSession = () => {
        setIsDeleteAlertOpen(true);
    };

    const handleConfirmDeleteSession = async () => {
        if (address) {
            await confirmDeleteSession(address, isConnected);
        }
        setIsDeleteAlertOpen(false);
    };

    if (!sessionKey) {
        return null;
    }

    return (
        <>
            <div className="tc-space-y-3">
                <Separator />
                <div className="tc-space-y-2">
                    <h4 className="tc-text-sm tc-font-medium">Withdraw funds & Delete key</h4>
                    <Button onClick={handleDeleteSession} disabled={isLoading} variant="outline">
                        Delete Session
                    </Button>
                </div>
            </div>

            {/* Delete Confirmation Alert Dialog */}
            <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will first attempt to withdraw any remaining funds back to your
                            wallet, then permanently delete your session key. You will need to
                            create a new key to continue playing.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDeleteSession}
                            disabled={isLoading}
                            className="tc-bg-destructive tc-text-destructive-foreground hover:tc-bg-destructive/90"
                        >
                            {isLoading && <Loader2 className="tc-mr-2 tc-h-4 tc-w-4 tc-animate-spin" />}
                            Delete Session
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
