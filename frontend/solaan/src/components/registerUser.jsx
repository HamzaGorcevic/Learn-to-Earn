// front-end/src/components/RegisterUser.jsx
import React, { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { getProgram } from "../anchor/setup";

export default function RegisterUser() {
    const { wallet, publicKey, connected, signTransaction } = useWallet();
    const { connection } = useConnection();
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");

    // Pre-fill user name with connected wallet's public key
    useEffect(() => {
        if (publicKey) {
            setName(publicKey.toString());
        } else {
            setName("");
        }
    }, [publicKey]);

    const handleRegister = async () => {
        console.log(
            "Connected:",
            connected,
            "PublicKey:",
            publicKey?.toString(),
            "SignTransaction:",
            !!signTransaction
        );

        if (!connected || !publicKey || !wallet || !signTransaction) {
            setMessage(
                "Please connect your wallet and ensure it supports transaction signing."
            );
            return;
        }
        if (!name) {
            setMessage("Please enter a name.");
            return;
        }

        try {
            console.log("Fetching program...");
            const program = getProgram(connection, wallet.adapter);
            console.log("Program initialized:", program.programId.toString());

            // Validate user wallet address
            let userPubkey;
            try {
                userPubkey = new PublicKey(publicKey.toString());
            } catch (err) {
                setMessage("Invalid wallet address.");
                return;
            }

            console.log("Sending register_user transaction...");

            const tx = await program.methods
                .registerUser() // Register the user with no parent-child logic
                .accounts({
                    userData: userPubkey,
                    user: publicKey,
                    systemProgram: SystemProgram.programId,
                })
                .rpc();

            console.log("Transaction signature:", tx);

            // Send data to backend
            const response = await fetch("http://localhost:3000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userWallet: publicKey.toString(),
                    name,
                    tx,
                }),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(
                    result.error || "Failed to register in database"
                );
            }

            setMessage(`User registered! Transaction: ${tx}`);
        } catch (err) {
            console.error("Registration error:", err);
            setMessage(`Error: ${err.message}`);
        }
    };

    return (
        <div className="mt-4">
            <h2 className="text-lg mb-2">Register User</h2>
            <input
                className="border p-2 mb-2 w-full"
                type="text"
                placeholder="User Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleRegister}
            >
                Register
            </button>
            {message && <p className="mt-2">{message}</p>}
        </div>
    );
}
