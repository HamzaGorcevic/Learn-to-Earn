import web3 from "@solana/web3.js";

const connection = new web3.Connection(
    "https://api.devnet.solana.com",
    "confirmed"
);

export default connection;
