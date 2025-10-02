import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { 
    TENProvider,
    ConnectWalletButton,
    SessionKeyManager
} from '../src/index';
import {useAccount} from "wagmi";

// Simple minimal usage example
const WalletOnlyExample = () => (
    <TENProvider>
            <div className="p-8 max-w-md mx-auto bg-white rounded-lg shadow-lg">
                <header className="flex flex-col justify-center items-center">
                    <h1 className="text-2xl font-bold mb-4 text-center">My TEN dApp</h1>
                    <div className="flex gap-4 justify-center mb-6">
                        <ConnectWalletButton/>
                    </div>
                </header>
                <ExampleContent/>
            </div>
    </TENProvider>
);

const ExampleContent = () => {
    const {isConnected} = useAccount()

    if (isConnected) {
        return (<div className="text-center space-y-4">
            <p className="text-gray-600">
                Your dApp content goes here. It will only be visible when
                the user is connected to TEN Protocol.
            </p>

            <div className="grid grid-cols-1 gap-4">
                <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                    Private Action 1
                </button>
                <button className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                    Private Action 2
                </button>
            </div>

            <p className="text-sm text-gray-500">
                All transactions are privacy-preserving thanks to TEN Protocol
            </p>
        </div>)
    } else {
        return (<p>Please connect your wallet.</p>)
    }
}

const meta: Meta<typeof WalletOnlyExample> = {
    title: 'TEN Connect/Wallet Only Usage',
    component: WalletOnlyExample,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'A minimal example showing how to integrate TEN Connect components into your dApp. This is the simplest possible setup with just the essential components.'
            }
        }
    },
    tags: ['autodocs'],
};

export default meta;type Story = StoryObj<typeof meta>;

export const Default: Story = {
    tags: ['!dev'], 
    parameters: {
        docs: {
            description: {
                story: 'The basic setup with ConnectWalletButton. Users must connect their wallet and be on the TEN Protocol network to see the dApp content.'
            },
            source: {
                code: `import React from 'react';
import { TENProvider, ConnectWalletButton } from '@ten-protocol/connect-react';
import { useAccount } from 'wagmi';

const WalletOnlyExample = () => (
    <TENProvider>
        <div className="p-8 max-w-md mx-auto bg-white rounded-lg shadow-lg">
            <header className="flex flex-col justify-center items-center">
                <h1 className="text-2xl font-bold mb-4 text-center">My TEN dApp</h1>
                <div className="flex gap-4 justify-center mb-6">
                    <ConnectWalletButton />
                </div>
            </header>
            <ExampleContent />
        </div>
    </TENProvider>
);

const ExampleContent = () => {
    const { isConnected } = useAccount()

    if (isConnected) {
        return (
            <div className="text-center space-y-4">
                <p className="text-gray-600">
                    Your dApp content goes here. It will only be visible when
                    the user is connected to TEN Protocol.
                </p>

                <div className="grid grid-cols-1 gap-4">
                    <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                        Private Action 1
                    </button>
                    <button className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                        Private Action 2
                    </button>
                </div>

                <p className="text-sm text-gray-500">
                    All transactions are privacy-preserving thanks to TEN Protocol
                </p>
            </div>
        )
    } else {
        return <p>Please connect your wallet.</p>
    }
}

export default WalletOnlyExample;`
            }
        }
    }
};
