import React, { useState } from "react";
import {
    useWallet,
    useConnection,
    useAnchorWallet,
} from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PublicKey, SystemProgram, Keypair } from "@solana/web3.js"; // ← import Keypair
import { getProgram } from "../anchor/setup";

export default function ConnectWallet() {
    const { publicKey, connected } = useWallet();
    const wallet = useAnchorWallet();
    const { connection } = useConnection();
    const [message, setMessage] = useState("");

    const handleConnectAndRegister = async () => {
        if (!connected || !publicKey || !wallet) {
            setMessage("Please connect your wallet.");
            return;
        }

        try {
            const program = getProgram(connection, wallet);

            // 1) generate a new Keypair for user_data
            const userDataKeypair = Keypair.generate();

            // 2) compute your existing state PDA as before
            const [statePda] = PublicKey.findProgramAddressSync(
                [Buffer.from("state")],
                program.programId
            );

            // 3) call registerUser, passing userData = keypair.pubkey,
            //    and including that keypair in .signers()
            const tx = await program.methods
                .registerUser()
                .accounts({
                    userData: userDataKeypair.publicKey,
                    user: publicKey,
                    systemProgram: SystemProgram.programId,
                    state: statePda,
                })
                .signers([userDataKeypair]) // ← include the new keypair
                .rpc();

            console.log("Transaction signature:", tx);

            // …then your backend call as before…
            const response = await fetch("http://localhost:3000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    walletAddress: publicKey.toString(),
                    name: publicKey.toString(),
                    parentWalletAddress:
                        "61jYfLtb9SEreNV2G6XB1MUUdr7PHnCuGme3UhmBMsxj",
                    tx,
                }),
            });
            const result = await response.json();
            if (!response.ok)
                throw new Error(result.error || "Failed to register");

            setMessage(
                `Connected and registered! User ID: ${result.userId}, Tx: ${tx}`
            );
        } catch (err) {
            console.error("Error:", err);
            if (err.logs) console.error("Program logs:", err.logs);
            setMessage(`Error: ${err.message}`);
        }
    };

    return (
        <div className="mt-4">
            <h2 className="text-lg mb-2">Connect to STARPOINTS</h2>
            <WalletMultiButton />
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                onClick={handleConnectAndRegister}
                disabled={!connected}
            >
                Connect
            </button>
            {message && <p className="mt-2">{message}</p>}
        </div>
    );
}
