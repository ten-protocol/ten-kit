import { EIP1193Provider } from './types';
import { TEN_CHAIN_ID, DEFAULT_GAS_SETTINGS } from './constants';
import { toHex } from './encoding';

export async function getLatestBlockNumber(): Promise<string | null> {
    try {
        const response = await fetch('https://testnet-rpc.ten.xyz/v1/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_blockNumber',
                params: [],
                id: 1,
            }),
        });
        const data = await response.json();
        return data.result;
    } catch (error) {
        console.warn('Failed to get latest block number:', error);
        return null;
    }
}

export function toRlpHex(value: bigint | number): string {
    const hex = toHex(value);
    // Remove 0x prefix for RLP encoding
    return hex.slice(2);
}

export async function checkTenNetwork(provider: EIP1193Provider): Promise<void> {
    const chainId = await provider.request({ method: 'eth_chainId' });
    const chainIdInt = parseInt(chainId, 16);
    
    if (chainIdInt !== TEN_CHAIN_ID) {
        throw new Error(`Please switch to TEN Protocol network (Chain ID: ${TEN_CHAIN_ID})`);
    }
}

export async function calculateGasFees(
    provider: EIP1193Provider,
    priority: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM'
): Promise<{
    maxFeePerGas: bigint;
    maxPriorityFeePerGas: bigint;
}> {
    try {
        // Get fee history
        const feeHistory = await provider.request({
            method: 'eth_feeHistory',
            params: [
                toHex(DEFAULT_GAS_SETTINGS.FEE_HISTORY_BLOCKS),
                'latest',
                DEFAULT_GAS_SETTINGS.PRIORITY_FEE_PERCENTILES,
            ],
        });

        // Get base fee from latest block
        const latestBaseFee = BigInt(feeHistory.baseFeePerGas[feeHistory.baseFeePerGas.length - 1]);

        // Calculate priority fee from percentiles
        const priorityFees = feeHistory.reward.map((block: string[]) => 
            block.map((fee: string) => BigInt(fee))
        );

        // Get median priority fee for the selected priority level
        const priorityIndex = priority === 'LOW' ? 0 : priority === 'HIGH' ? 2 : 1;
        const priorityFeeValues = priorityFees.map((block: bigint[]) => block[priorityIndex]);
        const medianPriorityFee = priorityFeeValues.sort((a: bigint, b: bigint) => 
            a < b ? -1 : a > b ? 1 : 0
        )[Math.floor(priorityFeeValues.length / 2)];

        // Apply multiplier to base fee
        const multiplier = DEFAULT_GAS_SETTINGS.BASE_FEE_MULTIPLIERS[priority];
        const adjustedBaseFee = BigInt(Math.floor(Number(latestBaseFee) * multiplier));

        // Ensure minimum priority fee to avoid RLP encoding issues
        const minPriorityFee = 1000000000n; // 1 gwei minimum
        const finalPriorityFee = medianPriorityFee > 0n ? medianPriorityFee : minPriorityFee;
        
        const result = {
            maxFeePerGas: adjustedBaseFee + finalPriorityFee,
            maxPriorityFeePerGas: finalPriorityFee,
        };
        
        
        return result;
    } catch (error) {
        console.warn('Failed to calculate gas fees, using defaults:', error);
        // Fallback to reasonable defaults
        const baseFee = 1000000000n; // 1 gwei
        const priorityFee = priority === 'LOW' ? 1000000000n : priority === 'HIGH' ? 3000000000n : 2000000000n;
        
        return {
            maxFeePerGas: baseFee + priorityFee,
            maxPriorityFeePerGas: priorityFee,
        };
    }
}

export function setupProviderListeners(
    provider: EIP1193Provider,
    onUpdate: (updates: any) => void,
    cleanupRef: { current: (() => void) | null }
): void {
    if (!provider.on || !provider.removeListener) return;

    const handleAccountsChanged = () => {
        onUpdate({ isActive: false });
    };

    const handleChainChanged = () => {
        onUpdate({ isActive: false });
    };

    provider.on('accountsChanged', handleAccountsChanged);
    provider.on('chainChanged', handleChainChanged);

    // Store cleanup function
    cleanupRef.current = () => {
        if (provider.removeListener) {
            provider.removeListener('accountsChanged', handleAccountsChanged);
            provider.removeListener('chainChanged', handleChainChanged);
        }
    };
}
