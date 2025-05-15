import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import idlJSON from "./idl.js";
import connection from "./connection.js";
import wallet from "./wallet.js";

export const mintStarpoints = async (userAddress, score) => {
    try {
        const provider = new anchor.AnchorProvider(
            connection,
            new anchor.Wallet(wallet),
            { preflightCommitment: "confirmed" }
        );
        const program = new anchor.Program(idlJSON, provider);

        const userPubkey = new PublicKey(userAddress);
        const mint = new PublicKey(process.env.MINT_ADDRESS);
        const [statePda] = PublicKey.findProgramAddressSync(
            [Buffer.from("state")],
            program.programId
        );
        const [userDataPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("user"), userPubkey.toBuffer()],
            program.programId
        );

        const userTokenAccount = await connection.getTokenAccountsByOwner(
            userPubkey,
            { mint }
        );
        if (!userTokenAccount.value.length) {
            return { success: false, error: "User token account not found" };
        }
        const userTokenAccountPubkey = userTokenAccount.value[0].pubkey;

        const tx = await program.methods
            .mintStarpoints(new anchor.BN(score))
            .accounts({
                mint,
                userTokenAccount: userTokenAccountPubkey,
                user: userPubkey,
                authority: wallet.publicKey,
                tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
                state: statePda,
                userData: userDataPda,
            })
            .signers([wallet])
            .rpc();

        return { success: true, tx };
    } catch (err) {
        return { success: false, error: err.message };
    }
};
