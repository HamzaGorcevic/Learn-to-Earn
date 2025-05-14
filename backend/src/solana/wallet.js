import web3 from "@solana/web3.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
console.log(__filename);
const __dirname = path.dirname(__filename);

const secretPath = path.join(__dirname, "wallet1.json");
const secret = JSON.parse(fs.readFileSync(secretPath));

const wallet = web3.Keypair.fromSecretKey(new Uint8Array(secret));

export default wallet;
