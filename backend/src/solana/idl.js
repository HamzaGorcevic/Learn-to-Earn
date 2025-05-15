const idlJSON = {
    address: "3u6Av28TMrktWjba344FN5Db8DptdrYRcFtHE7BhbBFr",
    metadata: {
        name: "starpoints",
        version: "0.1.0",
        spec: "0.1.0",
        description: "Starpoints Solana Program",
    },
    instructions: [
        {
            name: "claim_badge",
            discriminator: [111, 30, 18, 17, 228, 252, 239, 102],
            accounts: [
                {
                    name: "badge",
                    writable: true,
                    pda: {
                        seeds: [
                            {
                                kind: "const",
                                value: [98, 97, 100, 103, 101],
                            },
                            {
                                kind: "account",
                                path: "user",
                            },
                            {
                                kind: "arg",
                                path: "game_id",
                            },
                        ],
                    },
                },
                {
                    name: "user",
                    writable: true,
                    signer: true,
                },
                {
                    name: "system_program",
                    address: "11111111111111111111111111111111",
                },
            ],
            args: [
                {
                    name: "game_id",
                    type: "u64",
                },
            ],
        },
        {
            name: "initialize",
            discriminator: [175, 175, 109, 31, 13, 152, 155, 237],
            accounts: [
                {
                    name: "state",
                    writable: true,
                    signer: true,
                },
                {
                    name: "authority",
                    writable: true,
                    signer: true,
                },
                {
                    name: "system_program",
                    address: "11111111111111111111111111111111",
                },
            ],
            args: [],
        },
        {
            name: "mint_starpoints",
            discriminator: [143, 18, 149, 73, 6, 65, 135, 124],
            accounts: [
                {
                    name: "mint",
                    writable: true,
                },
                {
                    name: "user_token_account",
                    writable: true,
                },
                {
                    name: "user",
                    writable: true,
                    signer: true,
                },
                {
                    name: "authority",
                    writable: true,
                    signer: true,
                },
                {
                    name: "token_program",
                    address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                },
                {
                    name: "state",
                    writable: true,
                },
                {
                    name: "user_data",
                    writable: true,
                },
            ],
            args: [
                {
                    name: "score",
                    type: "u64",
                },
            ],
        },
        {
            name: "redeem_reward",
            discriminator: [20, 221, 205, 146, 25, 114, 178, 198],
            accounts: [
                {
                    name: "mint",
                    writable: true,
                },
                {
                    name: "user_token_account",
                    writable: true,
                },
                {
                    name: "user",
                    writable: true,
                    signer: true,
                },
                {
                    name: "token_program",
                    address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                },
                {
                    name: "state",
                    writable: true,
                },
                {
                    name: "user_data",
                    writable: true,
                },
            ],
            args: [
                {
                    name: "amount",
                    type: "u64",
                },
                {
                    name: "reward_type",
                    type: "string",
                },
            ],
        },
        {
            name: "register_user",
            discriminator: [2, 241, 150, 223, 99, 214, 116, 97],
            accounts: [
                {
                    name: "user_data",
                    writable: true,
                    signer: true,
                },
                {
                    name: "user",
                    writable: true,
                    signer: true,
                },
                {
                    name: "system_program",
                    address: "11111111111111111111111111111111",
                },
                {
                    name: "state",
                    writable: true,
                },
            ],
            args: [],
        },
    ],
    accounts: [
        {
            name: "Badge",
            discriminator: [40, 127, 162, 181, 177, 154, 1, 48],
        },
        {
            name: "ProgramState",
            discriminator: [77, 209, 137, 229, 149, 67, 167, 230],
        },
        {
            name: "UserData",
            discriminator: [139, 248, 167, 203, 253, 220, 210, 221],
        },
    ],
    errors: [
        {
            code: 6000,
            name: "InsufficientPoints",
            msg: "Insufficient points for redemption",
        },
    ],
    types: [
        {
            name: "Badge",
            type: {
                kind: "struct",
                fields: [
                    {
                        name: "user",
                        type: "pubkey",
                    },
                    {
                        name: "game_id",
                        type: "u64",
                    },
                    {
                        name: "awarded_at",
                        type: "i64",
                    },
                ],
            },
        },
        {
            name: "ProgramState",
            type: {
                kind: "struct",
                fields: [
                    {
                        name: "authority",
                        type: "pubkey",
                    },
                    {
                        name: "total_users",
                        type: "u64",
                    },
                ],
            },
        },
        {
            name: "UserData",
            type: {
                kind: "struct",
                fields: [
                    {
                        name: "user",
                        type: "pubkey",
                    },
                    {
                        name: "total_points",
                        type: "u64",
                    },
                ],
            },
        },
    ],
};
export default idlJSON;
