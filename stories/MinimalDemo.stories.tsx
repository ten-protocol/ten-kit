import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { 
    WagmiWrapper, 
    ConnectWalletWrapper, 
    ConnectWalletButton,
    SessionKeyManager
} from '../src/index';

// Simple minimal usage example
const MinimalExample = () => (
    <WagmiWrapper>
        <ConnectWalletWrapper loading={false}>
            <div className="p-8 max-w-md mx-auto bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-4 text-center">My TEN dApp</h1>
                
                <div className="flex gap-4 justify-center mb-6">
                    <ConnectWalletButton />
                    <SessionKeyManager />
                </div>
                
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
            </div>
        </ConnectWalletWrapper>
    </WagmiWrapper>
);

const meta: Meta<typeof MinimalExample> = {
    title: 'TEN Connect/Minimal Usage',
    component: MinimalExample,
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

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    parameters: {
        docs: {
            description: {
                story: 'The basic setup with ConnectWalletButton and SessionKeyManager. Users must connect their wallet and be on the TEN Protocol network to see the dApp content.'
            }
        }
    }
};

// Loading state example
const LoadingExample = () => (
    <WagmiWrapper>
        <ConnectWalletWrapper loading={true}>
            <div className="p-8 max-w-md mx-auto bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-4 text-center">My TEN dApp</h1>
                <p className="text-center text-gray-600">This content is loading...</p>
            </div>
        </ConnectWalletWrapper>
    </WagmiWrapper>
);

export const LoadingState: Story = {
    render: () => <LoadingExample />,
    parameters: {
        docs: {
            description: {
                story: 'Shows how the wrapper handles loading states. When loading=true, the content is dimmed and interaction is disabled.'
            }
        }
    }
};

// Error state example
const ErrorExample = () => (
    <WagmiWrapper>
        <ConnectWalletWrapper loading={false} errorState={true}>
            <div className="p-8 max-w-md mx-auto bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-4 text-center">My TEN dApp</h1>
                <p className="text-center text-gray-600">This content has an error...</p>
            </div>
        </ConnectWalletWrapper>
    </WagmiWrapper>
);

export const ErrorState: Story = {
    render: () => <ErrorExample />,
    parameters: {
        docs: {
            description: {
                story: 'Shows how the wrapper handles error states. When errorState=true, it displays an error message with a link to the TEN Gateway.'
            }
        }
    }
};
