pub use anchor_lang::prelude::*;
pub use vipers::*;

pub mod error;
pub mod instructions;
pub mod state;

pub use error::*;
pub use instructions::*;
pub use state::*;

declare_id!("4c5WjWPmecCLHMSo8bQESo26VCotSKtjiUpCPnfEPL2p");

#[program]
pub mod transmuter {
    use super::*;

    // --------------------------------------- maker
    pub fn init_mutation(
        ctx: Context<InitMutation>,
        bump_auth: u8,
        _bump_a: u8,
        _bump_b: u8,
        _bump_c: u8,
        config: MutationConfig,
    ) -> ProgramResult {
        msg!("init new mutation");
        instructions::init_mutation::handler(ctx, bump_auth, config)
    }

    pub fn update_mutation(ctx: Context<UpdateMutation>) -> ProgramResult {
        msg!("update mutation");
        instructions::update_mutation::handler(ctx)
    }

    pub fn destroy_mutation(ctx: Context<DestroyMutation>) -> ProgramResult {
        msg!("destroy mutation");
        instructions::destroy_mutation::handler(ctx)
    }

    // --------------------------------------- taker

    pub fn execute_mutation(ctx: Context<ExecuteMutation>) -> ProgramResult {
        msg!("execute mutation");
        instructions::execute_mutation::handler(ctx)
    }

    pub fn abort_mutation(ctx: Context<AbortMutation>) -> ProgramResult {
        msg!("abort mutation");
        instructions::abort_mutation::handler(ctx)
    }
}
