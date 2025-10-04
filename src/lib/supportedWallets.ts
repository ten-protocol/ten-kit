import metamaskLogo from '../../public/assets/walletLogos/metamaskLogo.png';
import rabbyLogo from '../../public/assets/walletLogos/rabbyLogo.png';
import coinbaseLogo from '../../public/assets/walletLogos/coinbaseLogo.png';
import braveLogo from '../../public/assets/walletLogos/braveLogo.png';
import trustLogo from '../../public/assets/walletLogos/trustLogo.png';
import rainbowLogo from '../../public/assets/walletLogos/rainbowLogo.png';
import bitgetLogo from '../../public/assets/walletLogos/bitgetLogo.png';

export const supportedWallets = [
    {
        name: 'MetaMask',
        logo: metamaskLogo,
        supportStatus: '',
        url: 'https://metamask.io/'
    },
    // {
    //     name: 'Coinbase Wallet',
    //     logo: coinbaseLogo,
    //     supportStatus: '',
    //     id: 'com.coinbase.wallet',
    // },
    {
        name: 'Rabby Wallet',
        logo: rabbyLogo,
        supportStatus: '',
        id: 'io.rabby',
        url: 'https://rabby.io/'
    },
    // {
    //     name: 'Brave Wallet',
    //     logo: braveLogo,
    //     supportStatus: '',
    //     id: 'com.brave.wallet',
    // },
];
