import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig } from 'wagmi';
import { defineChain, http } from 'viem';
import { injected, unstable_connector, fallback } from 'wagmi';
import { sepolia } from 'viem/chains';
import { DEFAULT_TEN_CONFIG } from '../../lib/constants';
import type { TenConfig } from '../../lib/types';

const defaultQueryClient = new QueryClient();

export interface TenProviderProps {
    children: ReactNode;
    config?: TenConfig;
    queryClient?: QueryClient;
    enableSepolia?: boolean;
}

export default function WagmiWrapper({ 
    children, 
    config = DEFAULT_TEN_CONFIG,
    queryClient = defaultQueryClient,
    enableSepolia = false
}: TenProviderProps) {
    const tenChain = defineChain(config);
    
    const transports = enableSepolia 
        ? {
            [tenChain.id]: fallback([
                unstable_connector(injected),
                http(config.rpcUrls.default.http[0] || 'https://testnet-rpc.ten.xyz/v1/'),
            ]),
            [sepolia.id]: http(),
        }
        : {
            [tenChain.id]: fallback([
                unstable_connector(injected),
                http(config.rpcUrls.default.http[0] || 'https://testnet-rpc.ten.xyz/v1/'),
            ]),
        };

    const wagmiConfig = createConfig({
        chains: enableSepolia ? [sepolia, tenChain] : [tenChain],
        ssr: true,
        connectors: [injected()],
        transports,
    });

    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    );
}
