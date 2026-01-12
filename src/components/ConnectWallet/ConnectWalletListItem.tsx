import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Connector } from 'wagmi';
import { supportedWallets } from '@/lib/supportedWallets';

type Props = {
    connector: Connector;
    supported: boolean;
    onClick: () => void;
};

export default function ConnectWalletListItem({ connector, supported, onClick }: Props) {
    const handleClick = () => {
        onClick();
    };
    const matchedWallet = supportedWallets.find((wallet) => wallet.name === connector.name);
    const icon = connector.icon?.trimStart().trimEnd() || matchedWallet?.logo;

    return (
        <Button
            variant="outline"
            className="tc-w-full tc-justify-start tc-gap-4 tc-relative"
            onClick={handleClick}
            disabled={!supported}
        >
            <div>
                {icon ? (
                    <img
                        src={icon}
                        height={48}
                        width={48}
                        alt={connector.name}
                        className="tc-w-[32px]"
                    />
                ) : (
                    <Wallet className="tc-h-6 tc-w-6" />
                )}
            </div>
            <div className="tc-flex tc-flex-col tc-items-start tc-flex-grow">
                <span className="tc-font-medium">
                    {connector.name === 'Injected' ? 'Browser Wallet' : connector.name}
                </span>
                <span className="tc-text-sm tc-text-muted-foreground">
                    {connector.type === 'injected' ? 'Browser Extension' : connector.type}
                </span>
            </div>
        </Button>
    );
}
