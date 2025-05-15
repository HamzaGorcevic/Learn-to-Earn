import React from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
    ConnectionProvider,
    WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import InitializeProgram from "./components/initializeProgram";
import RegisterUser from "./components/registerUser";
import ConnectWallet from "./components/registerUser";

const App = () => {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = "https://api.devnet.solana.com"; // Use custom RPC if needed
    const wallets = [new PhantomWalletAdapter()];

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <div className="p-4">
                        <h1>STARPOINTS</h1>
                        <InitializeProgram />
                        <ConnectWallet />
                    </div>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default App;
