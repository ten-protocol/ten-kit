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
                    updateSessionKeyBalance();
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
            await updateSessionKeyBalance();
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
            <Card className="tc-bg-white/5">
                <CardContent>
                    <p className="tc-text-center tc-text-muted-foreground">No session key created yet</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="tc-bg-white/5">
            <CardHeader className="tc-flex-row tc-justify-between tc-relative">
                <CardTitle className="tc-text-lg">Session Key Info</CardTitle>
                {/* Troubleshooting */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"  className="tc-absolute -tc-top-4 tc-right-0">
                            <Settings className="tc-h-4 tc-w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="tc-w-56">
                        <DropdownMenuLabel>
                            <h6>Session Key Actions</h6>
                            <p className="tc-opacity-80 tc-text-xs tc-text-destructive">
                                These actions may be destructive & you risk losing funds in the
                                session key. Only use if you know what you&#39;re doing.
                            </p>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleClearLocalStorage} disabled={isLoading}>
                            <Database className="tc-mr-2 tc-h-4 tc-w-4" />
                            Clear Local State
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={handleTroubleshootDelete}
                            disabled={isLoading}
                            className="tc-text-destructive focus:tc-text-destructive"
                        >
                            <Trash2 className="tc-mr-2 tc-h-4 tc-w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent>
                <div className="tc-space-y-3">
                    <div className="tc-flex tc-items-center tc-justify-between">
                        <span className="tc-text-sm tc-font-medium">Address:</span>
                        <code className="tc-text-xs tc-bg-muted tc-px-2 tc-py-1 tc-rounded tc-font-mono">
                            <WalletAddress address={sessionKey} />
                        </code>
                    </div>
                    <div className="tc-flex tc-items-center tc-justify-between">
                        <span className="tc-text-sm tc-font-medium">Balance:</span>
                        <div className="tc-flex tc-items-center tc-gap-2">
                            <span className="tc-text-sm tc-font-mono">
                                {balance
                                    ? `${formatBalance(balance.eth.toString())} ETH`
                                    : 'Loading...'}
                            </span>
                            <Button
                                onClick={handleRefreshBalance}
                                disabled={isRefreshingBalance}
                                variant="ghost"
                                size="sm"
                                className="tc-h-6 tc-w-6 tc-p-0"
                            >
                                <RefreshCw
                                    className={`tc-h-3 tc-w-3 ${isRefreshingBalance ? 'tc-animate-spin' : ''}`}
                                />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
