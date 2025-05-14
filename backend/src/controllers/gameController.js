import { mintStarpoints } from "../solana/mint.js";

export const postResult = async (req, res) => {
    console.log(req.body);
    const { childId, gameId, score, success, walletAddress } = req.body;

    console.log(
        `Chil
        d ${childId} completed ${gameId} | Score: ${score} | Success: ${success}`
    );
    if (success && walletAddress) {
        const result = await mintStarpoints(walletAddress, score);
        res.status(200).json({
            message: "Game complete, STARPOINTS minted!",
            tx: result.tx,
        });
    } else {
        res.status(200).json({ message: "Game logged, no points awarded." });
    }
};
