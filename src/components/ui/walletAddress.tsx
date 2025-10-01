import React from 'react';
import { shortenAddress } from '../../lib/utils';

interface WalletAddressProps {
    address: string;
    chars?: number;
}

export function WalletAddress({ address, chars = 4 }: WalletAddressProps) {
    return <span>{shortenAddress(address, chars)}</span>;
}