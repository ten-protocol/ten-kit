import { ReactNode } from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import { WagmiProvider, createConfig } from 'wagmi';
import { defineChain, http } from 'viem';
import { injected, unstable_connector, fallback } from 'wagmi';
import { DEFAULT_TEN_CONFIG } from '@/lib/constants';
import type { TenConfig } from '@/lib/types';
import {useSessionKeyStore} from "@/stores/sessionKey.store";

const defaultQueryClient = new QueryClient();

export interface TenProviderProps {
    children: ReactNode;
    config?: TenConfig;
    queryClient?: QueryClient;
}

export function TENProvider({
    children, 
    config = DEFAULT_TEN_CONFIG,
    queryClient = defaultQueryClient
}: TenProviderProps) {
    const {setWagmiConfig} = useSessionKeyStore.getState()
    const tenChain = defineChain(config);

    const transports = {
            [tenChain.id]: fallback([
                unstable_connector(injected),
                http(config.rpcUrls.default.http[0] || 'https://testnet-rpc.ten.xyz/v1/'),
            ]),
        };

    const wagmiConfig = createConfig({
        chains: [tenChain],
        connectors: [injected()],
        transports,
    });

    setWagmiConfig(wagmiConfig);

    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    );
}
