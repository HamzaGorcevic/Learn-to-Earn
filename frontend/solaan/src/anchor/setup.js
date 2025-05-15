import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import idl from "../anchor/idl"; // Copy target/idl/starpoints.json here
import { PublicKey } from "@solana/web3.js";

export const getProgram = (connection, wallet) => {
    console.log(wallet);
    const provider = new anchor.AnchorProvider(
        connection,
        wallet,
        anchor.AnchorProvider.defaultOptions()
    );
    anchor.setProvider(provider);

    const program = new Program(idl, provider);

    return program;
};
