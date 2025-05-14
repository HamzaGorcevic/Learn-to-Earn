import express from "express";
import { createClient } from "@supabase/supabase-js";
import { mintStarpoints } from "./src/solana/mint.js";
import { claimBadge } from "./src/solana/claim.js";
import { redeemReward } from "./src/solana/redeem.js";
import dotenv from "dotenv";
import * as anchor from "@coral-xyz/anchor";
import idlJSON from "./src/solana/idl.js";
import connection from "./src/solana/connection.js";
import wallet from "./src/solana/wallet.js";
import { v4 as uuidv4 } from "uuid";

dotenv.config();
const app = express();
app.use(express.json());

const provider = new anchor.AnchorProvider(
    connection,
    new anchor.Wallet(wallet),
    { preflightCommitment: "confirmed" }
);

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

app.post("/register", async (req, res) => {
    console.log("we hit register");
    const { walletAddress, name, tx } = req.body;
    if (!walletAddress || !name || !tx) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        // Verify transaction on Solana
        const txResult = await connection.getTransaction(tx, {
            commitment: "confirmed",
        });
        if (!txResult || txResult.meta.err) {
            throw new Error("Transaction failed or not found");
        }

        // Save to Supabase
        const userId = uuidv4();
        const { error } = await supabase.from("users").insert({
            id: userId,
            wallet_address: walletAddress,
            name,
        });

        if (error) throw error;

        res.status(200).json({
            message: "User registered in database",
            userId,
            tx,
        });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({
            error: err.message || "Failed to register user",
        });
    }
});

app.post("/mint", async (req, res) => {
    const { userId, gameId, score, success, walletAddress } = req.body;
    console.log(
        `User ${userId} completed ${gameId} | Score: ${score} | Success: ${success}`
    );

    if (!success || !walletAddress) {
        return res
            .status(200)
            .json({ message: "Game logged, no points awarded." });
    }

    try {
        const mintResult = await mintStarpoints(walletAddress, score);
        if (!mintResult.success) throw new Error(mintResult.error);

        const badgeResult = await claimBadge(walletAddress, gameId);
        if (!badgeResult.success) throw new Error(badgeResult.error);

        const { error } = await supabase
            .from("game_sessions")
            .insert({ user_id: userId, game_id: gameId, score, success });
        if (error) throw new Error(error.message);

        res.status(200).json({
            message: "Game complete, STARPOINTS minted and badge claimed!",
            tx: mintResult.tx,
            badgeTx: badgeResult.tx,
        });
    } catch (err) {
        console.error("Error processing result:", err);
        res.status(500).json({ error: "Failed to process game result" });
    }
});

app.get("/user/:id/badges", async (req, res) => {
    const { id } = req.params;
    try {
        const { data: user, error: userError } = await supabase
            .from("users")
            .select("wallet_address")
            .eq("id", id)
            .single();
        if (userError || !user) throw new Error("User not found");

        const program = new anchor.Program(idlJSON, provider);
        const badgeAccounts = await program.account.badge.all([
            {
                memcmp: {
                    offset: 8, // Discriminator offset
                    bytes: user.wallet_address,
                },
            },
        ]);

        const badges = badgeAccounts.map((account) => ({
            gameId: account.account.gameId.toNumber(),
            awardedAt: account.account.awardedAt.toNumber(),
        }));

        res.status(200).json({ badges });
    } catch (err) {
        console.error("Error fetching badges:", err);
        res.status(500).json({ error: "Failed to fetch badges" });
    }
});

app.post("/redeem", async (req, res) => {
    const { userId, walletAddress, rewardType, amount } = req.body;
    try {
        const redeemResult = await redeemReward(
            walletAddress,
            amount,
            rewardType
        );
        if (!redeemResult.success) throw new Error(redeemResult.error);

        const { error } = await supabase
            .from("reward_claims")
            .insert({ user_id: userId, reward_type: rewardType, amount });
        if (error) throw new Error(error.message);

        res.status(200).json({
            message: `Redeemed ${amount} STARPOINTS for ${rewardType}`,
            tx: redeemResult.tx,
        });
    } catch (err) {
        console.error("Error redeeming reward:", err);
        res.status(500).json({ error: "Failed to redeem reward" });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
