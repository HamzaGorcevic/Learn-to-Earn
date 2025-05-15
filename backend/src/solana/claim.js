import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import idlJSON from "./idl.js";
import connection from "./connection.js";
import wallet from "./wallet.js";

export const claimBadge = async (userAddress, gameId) => {
    try {
        const provider = new anchor.AnchorProvider(
            connection,
            new anchor.Wallet(wallet),
            { preflightCommitment: "confirmed" }
        );
        const program = new anchor.Program(idlJSON, provider);

        const userPubkey = new PublicKey(userAddress);
        const [badgePda, bump] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("badge"),
                userPubkey.toBuffer(),
                new anchor.BN(gameId).toArrayLike(Buffer, "le", 8),
            ],
            program.programId
        );

        const tx = await program.methods
            .claimBadge(new anchor.BN(gameId))
            .accounts({
                badge: badgePda,
                user: userPubkey,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .signers([wallet])
            .rpc();

        return { success: true, tx };
    } catch (err) {
        return { success: false, error: err.message };
    }
};
