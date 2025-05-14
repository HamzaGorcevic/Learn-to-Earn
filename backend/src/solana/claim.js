import * as anchor from "@coral-xyz/anchor";
import connection from "./connection.js";
import wallet from "./wallet.js";
import idlJSON from "./idl.js";
import { PublicKey, SystemProgram } from "@solana/web3.js";

const PROGRAM_ID = new PublicKey(
    "F6C2p3QV4fcFpxGdV3bcjURgQEP1MM9dTru24qpyDXAw"
);

const provider = new anchor.AnchorProvider(
    connection,
    new anchor.Wallet(wallet),
    { preflightCommitment: "confirmed" }
);

const program = new anchor.Program(idlJSON, provider);

export const claimBadge = async (walletAddress, gameId) => {
    try {
        const userPubkey = new PublicKey(walletAddress);
        const [badgeAccount] = await PublicKey.findProgramAddress(
            [
                Buffer.from("badge"),
                userPubkey.toBuffer(),
                new anchor.BN(gameId).toArray("le", 8),
            ],
            PROGRAM_ID
        );
        const [childDataAccount] = await PublicKey.findProgramAddress(
            [Buffer.from("child_data"), userPubkey.toBuffer()],
            PROGRAM_ID
        );
        const [stateAccount] = await PublicKey.findProgramAddress(
            [Buffer.from("state")],
            PROGRAM_ID
        );

        const tx = await program.methods
            .claimBadge(new anchor.BN(gameId))
            .accounts({
                badgeAccount,
                child: userPubkey,
                state: stateAccount,
                childData: childDataAccount,
                systemProgram: SystemProgram.programId,
            })
            .rpc();

        console.log("✅ Badge claimed:", tx);
        return { success: true, tx };
    } catch (err) {
        console.error("❌ Error claiming badge:", err);
        return { success: false, error: err.message };
    }
};
