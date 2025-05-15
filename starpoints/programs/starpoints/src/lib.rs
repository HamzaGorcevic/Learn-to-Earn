use anchor_lang::prelude::*;
use anchor_spl::token::{self, Burn, Mint, MintTo, Token, TokenAccount};

declare_id!("3u6Av28TMrktWjba344FN5Db8DptdrYRcFtHE7BhbBFr");

#[program]
pub mod starpoints {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let state = &mut ctx.accounts.state;
        state.authority = ctx.accounts.authority.key();
        state.total_users = 0;
        Ok(())
    }

    pub fn register_user(ctx: Context<RegisterUser>) -> Result<()> {
        let user_data = &mut ctx.accounts.user_data;
        let state = &mut ctx.accounts.state;
        user_data.user = ctx.accounts.user.key();
        user_data.total_points = 0;
        state.total_users += 1;
        msg!("User registered: {}", ctx.accounts.user.key());
        Ok(())
    }

    pub fn mint_starpoints(ctx: Context<MintStarpoints>, score: u64) -> Result<()> {
        let cpi_accounts = MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::mint_to(cpi_ctx, score)?;

        let user_data = &mut ctx.accounts.user_data;
        user_data.total_points += score;

        msg!("Minted {} starpoints to {}", score, ctx.accounts.user.key());
        Ok(())
    }

    pub fn claim_badge(ctx: Context<ClaimBadge>, game_id: u64) -> Result<()> {
        let badge = &mut ctx.accounts.badge;
        badge.user = ctx.accounts.user.key();
        badge.game_id = game_id;
        badge.awarded_at = Clock::get()?.unix_timestamp;

        msg!("Badge claimed for game {} by {}", game_id, ctx.accounts.user.key());
        Ok(())
    }

    pub fn redeem_reward(ctx: Context<RedeemReward>, amount: u64, reward_type: String) -> Result<()> {
        require!(
            ctx.accounts.user_data.total_points >= amount,
            GameError::InsufficientPoints
        );

        let cpi_accounts = Burn {
            mint: ctx.accounts.mint.to_account_info(),
            from: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::burn(cpi_ctx, amount)?;

        let user_data = &mut ctx.accounts.user_data;
        user_data.total_points -= amount;

        msg!("Redeemed {} points for reward: {}", amount, reward_type);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 8)]
    pub state: Account<'info, ProgramState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RegisterUser<'info> {
    #[account(init, payer = user, space = 8 + 32 + 8)]
    pub user_data: Account<'info, UserData>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
    #[account(mut)]
    pub state: Account<'info, ProgramState>,
}

#[derive(Accounts)]
pub struct MintStarpoints<'info> {
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
    #[account(mut)]
    pub state: Account<'info, ProgramState>,
    #[account(mut)]
    pub user_data: Account<'info, UserData>,
}

#[derive(Accounts)]
#[instruction(game_id: u64)]
pub struct ClaimBadge<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 8 + 8,
        seeds = [b"badge", user.key().as_ref(), game_id.to_le_bytes().as_ref()],
        bump
    )]
    pub badge: Account<'info, Badge>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RedeemReward<'info> {
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
    #[account(mut)]
    pub state: Account<'info, ProgramState>,
    #[account(mut)]
    pub user_data: Account<'info, UserData>,
}

#[account]
pub struct ProgramState {
    pub authority: Pubkey,
    pub total_users: u64,
}

#[account]
pub struct UserData {
    pub user: Pubkey,
    pub total_points: u64,
}

#[account]
pub struct Badge {
    pub user: Pubkey,
    pub game_id: u64,
    pub awarded_at: i64,
}

#[error_code]
pub enum GameError {
    #[msg("Insufficient points for redemption")]
    InsufficientPoints,
}