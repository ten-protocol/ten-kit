import {defineChain, http} from "viem";
import {Config, fallback, injected, unstable_connector} from "wagmi";
import {DEFAULT_TEN_CONFIG} from "@/lib/constants";
import {CreateConfigParameters} from "@wagmi/core/src/createConfig";

export const tenChain = defineChain(DEFAULT_TEN_CONFIG);

export const TENTransports = {
    [tenChain.id]: fallback([
        unstable_connector(injected),
        http(DEFAULT_TEN_CONFIG.rpcUrls.default.http[0] || 'https://testnet-rpc.ten.xyz/v1/'),
    ]),
};

export const TENWagmiConfig: CreateConfigParameters = {
    chains: [tenChain],
    connectors: [injected()],
    transports: TENTransports,
};