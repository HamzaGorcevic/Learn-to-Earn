import React, { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { getProgram } from "../anchor/setup";

export default function InitializeProgram() {
    const { wallet, publicKey, connected, signTransaction } = useWallet();
    const { connection } = useConnection();
    const [message, setMessage] = useState("");

    const handleInitialize = async () => {
        if (!connected || !publicKey || !wallet || !signTransaction) {
            setMessage("Please connect your wallet.");
            return;
        }

        try {
            const program = getProgram(connection, wallet.adapter);
            const [statePda] = PublicKey.findProgramAddressSync(
                [Buffer.from("state")],
                program.programId
            );

            console.log("Initializing program state...");

            const tx = await program.methods
                .initialize()
                .accounts({
                    state: statePda,
                    authority: publicKey,
                    systemProgram: SystemProgram.programId,
                })
                .rpc();

            setMessage(`Program initialized! Transaction: ${tx}`);
        } catch (err) {
            console.error("Initialization error:", err);
            if (err.logs) {
                console.error("Program logs:", err.logs);
            }
            setMessage(`Error: ${err.message}`);
        }
    };

    return (
        <div className="mt-4">
            <h2 className="text-lg mb-2">Initialize Program</h2>
            <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleInitialize}
                disabled={!connected}
            >
                Initialize
            </button>
            {message && <p className="mt-2">{message}</p>}
        </div>
    );
}
