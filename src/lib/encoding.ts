import { formatUnits, parseUnits } from 'viem';

export const toHex = (value: number | bigint | string): string => {
    if (typeof value === 'string') {
        // If it's already a hex string, return as-is
        if (value.startsWith('0x')) {
            return value;
        }
        // If it's a decimal string, parse it
        return `0x${BigInt(value).toString(16)}`;
    }
    return `0x${BigInt(value).toString(16)}`;
};

export const hexToBytes = (hex: string): Uint8Array => {
    const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
    const bytes = new Uint8Array(cleanHex.length / 2);
    for (let i = 0; i < cleanHex.length; i += 2) {
        bytes[i / 2] = parseInt(cleanHex.slice(i, i + 2), 16);
    }
    return bytes;
};

export const bytesToHex = (bytes: Uint8Array): string => {
    return '0x' + Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
};

export const parseEther = (value: string): bigint => {
    return parseUnits(value, 18);
};

export const formatEther = (value: bigint): string => {
    return formatUnits(value, 18);
};

export const estimateTransactions = (balance: bigint, gasPrice: bigint, gasLimit: bigint): number => {
    if (balance <= 0n || gasPrice <= 0n || gasLimit <= 0n) return 0;
    const costPerTx = gasPrice * gasLimit;
    return Number(balance / costPerTx);
};

export const hexToAscii = (hex: string): string => {
    const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
    let ascii = '';
    for (let i = 0; i < cleanHex.length; i += 2) {
        const byte = parseInt(cleanHex.slice(i, i + 2), 16);
        if (byte !== 0) { // Skip null bytes
            ascii += String.fromCharCode(byte);
        }
    }
    return ascii;
};
