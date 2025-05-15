import bs58 from "bs58";
import { Keypair } from "@solana/web3.js";

const privateKeyBytes = [
    58, 255, 246, 187, 53, 158, 84, 175, 78, 223, 221, 241, 185, 178, 88, 41,
    254, 5, 39, 197, 223, 24, 58, 16, 195, 189, 251, 234, 141, 112, 163, 194,
    74, 122, 138, 154, 2, 200, 5, 26, 214, 196, 234, 95, 126, 239, 127, 48, 145,
    235, 59, 244, 73, 228, 136, 15, 73, 7, 38, 173, 80, 60, 228, 104,
];

const keypair = Keypair.fromSecretKey(Uint8Array.from(privateKeyBytes));
const base58Key = bs58.encode(Buffer.from(privateKeyBytes));
console.log("Base58 Private Key:", base58Key);
console.log("Public Key:", keypair.publicKey.toBase58());
