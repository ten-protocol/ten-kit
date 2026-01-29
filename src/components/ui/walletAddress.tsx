import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { shortenAddress, cn } from '../../lib/utils';

interface WalletAddressProps {
    address: string;
    chars?: number;
}

export function WalletAddress({ address, chars = 4 }: WalletAddressProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <span className="tc-inline-flex tc-items-center tc-gap-1.5">
            <span>{shortenAddress(address, chars)}</span>
            <button
                onClick={handleCopy}
                className={cn(
                    "tc-p-1 tc-rounded tc-transition-colors hover:tc-bg-muted",
                    copied && "tc-text-green-500"
                )}
                title={copied ? "Copied!" : "Copy address"}
            >
                {copied ? (
                    <Check className="tc-h-3.5 tc-w-3.5" />
                ) : (
                    <Copy className="tc-h-3.5 tc-w-3.5" />
                )}
            </button>
        </span>
    );
}
