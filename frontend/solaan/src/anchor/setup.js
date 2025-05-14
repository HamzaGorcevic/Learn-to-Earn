// front-end/src/anchor/setup.js
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import idl from "./idl";

const programId = new PublicKey("F6C2p3QV4fcFpxGdV3bcjURgQEP1MM9dTru24qpyDXAw");

export const getProgram = (connection, walletAdapter) => {
    const provider = new AnchorProvider(connection, walletAdapter, {
        preflightCommitment: "confirmed",
    });

    const program = new Program(idl, provider);
    return program;
};
