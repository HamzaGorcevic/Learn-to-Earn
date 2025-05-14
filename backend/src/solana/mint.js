import BN from "bn.js";
import * as anchor from "@coral-xyz/anchor";
import connection from "./connection.js";
import wallet from "./wallet.js";
import idlJSON from "./idl.js";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";

const PROGRAM_ID = new PublicKey(
    "F6C2p3QV4fcFpxGdV3bcjURgQEP1MM9dTru24qpyDXAw"
);

const provider = new anchor.AnchorProvider(
    connection,
    new anchor.Wallet(wallet),
    { preflightCommitment: "confirmed" }
);

const program = new anchor.Program(idlJSON, provider);

export const mintStarpoints = async (walletAddress, score = 10) => {
    try {
        const scoreBN = new BN(score.toString());
        const userPubkey = new PublicKey(walletAddress);
        const mintPubkey = new PublicKey(
            "J1wY1TdDZLdNjSXvhQEivUCKtpKHUVySdTjEoyryRr97"
        );
        const childTokenAccount = await getAssociatedTokenAddress(
            mintPubkey,
            userPubkey
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
            .mintStarpoints(scoreBN)
            .accounts({
                mint: mintPubkey,
                childTokenAccount,
                child: userPubkey,
                authority: provider.wallet.publicKey,
                state: stateAccount,
                childData: childDataAccount,
                tokenProgram: TOKEN_PROGRAM_ID,
            })
            .rpc();

        console.log("✅ Transaction sent:", tx);
        return { success: true, tx };
    } catch (err) {
        console.error("❌ Error minting starpoints:", err);
        return { success: false, error: err.message };
    }
};
