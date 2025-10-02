import React, { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { RefreshCw, Settings, Database, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WalletAddress } from '@/components/ui/walletAddress';
import { formatBalance } from '@/lib/utils';
import { useSessionKeyManagerStore } from '@/stores/sessionKeyManager.store';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSessionKeyStore } from '@/stores/sessionKey.store';

export default function SessionKeyInfo() {
    const { connector, isConnected } = useAccount();
    const { isRefreshingBalance, updateSessionKeyBalance, clearLocalStorage } =
        useSessionKeyManagerStore();
    const { balance, sessionKey, isLoading } = useSessionKeyStore();

    useEffect(() => {
        const checkBalance = setInterval(async () => {
            const sk = sessionKey;
            if (sk) {
                const provider = await connector?.getProvider();
                if (provider) {
                    updateSessionKeyBalance(sk, provider);
                }
            }
        }, 5000);

        return () => {
            clearInterval(checkBalance);
        };
    }, [isConnected, connector, updateSessionKeyBalance, sessionKey]);

    const handleRefreshBalance = async () => {
        if (!sessionKey) return;
        const provider = await connector?.getProvider();
        if (provider) {
            await updateSessionKeyBalance(sessionKey, provider);
        }
    };

    const handleClearLocalStorage = () => {
        clearLocalStorage();
    };

    const handleTroubleshootDelete = () => {
        // This will be handled by the SessionKeyTrash component
    };

    if (!sessionKey) {
        return (
            <Card className="bg-white/5">
                <CardContent>
                    <p className="text-center text-muted-foreground">No session key created yet</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-white/5">
            <CardHeader className="flex-row justify-between">
                <CardTitle className="text-lg">Session Key Info</CardTitle>
                {/* Troubleshooting */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Settings className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>
                            <h6>Session Key Actions</h6>
                            <p className="opacity-80 text-xs text-destructive">
                                These actions may be destructive & you risk losing funds in the
                                session key. Only use if you know what you&#39;re doing.
                            </p>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleClearLocalStorage} disabled={isLoading}>
                            <Database className="mr-2 h-4 w-4" />
                            Clear Local State
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={handleTroubleshootDelete}
                            disabled={isLoading}
                            className="text-destructive focus:text-destructive"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Address:</span>
                        <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                            <WalletAddress address={sessionKey} />
                        </code>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Balance:</span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-mono">
                                {balance
                                    ? `${formatBalance(balance.eth.toString())} ETH`
                                    : 'Loading...'}
                            </span>
                            <Button
                                onClick={handleRefreshBalance}
                                disabled={isRefreshingBalance}
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                            >
                                <RefreshCw
                                    className={`h-3 w-3 ${isRefreshingBalance ? 'animate-spin' : ''}`}
                                />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
