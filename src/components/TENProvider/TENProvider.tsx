import {ReactNode} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import { WagmiProvider, createConfig } from 'wagmi';
import { DEFAULT_TEN_CONFIG } from '@/lib/constants';
import type { TenConfig } from '@/lib/types';
import {TENWagmiConfig} from "@/lib/tenConfig";

const defaultQueryClient = new QueryClient();

export interface TenProviderProps {
    children: ReactNode;
    config?: TenConfig;
    queryClient?: QueryClient;
}

// Deprecated - It's not recommended to use this provider.
export function TENProvider({
    children, 
    config = DEFAULT_TEN_CONFIG,
    queryClient = defaultQueryClient
}: TenProviderProps) {

    const wagmiConfig = createConfig(TENWagmiConfig);

    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    );
}
