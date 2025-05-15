import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import dotenv from "dotenv";
dotenv.config();

// Ensure PRIVATE_KEY is loaded and is a string
const privateKey = process.env.PRIVATE_KEY;

if (!privateKey || typeof privateKey !== "string") {
    throw new Error(
        "PRIVATE_KEY environment variable is not set or is not a string."
    );
}

const keypair = Keypair.fromSecretKey(bs58.decode(privateKey));
export default keypair;
