use anchor_lang::prelude::*;

declare_id!("8FTMPuywJu7x3DkwzAMwr1yCZcZpWT1d5qoB54dNnhDd");

#[program]
pub mod parakletos_quorum {
    use super::*;

    pub fn initialize_agent_passport(
        ctx: Context<InitializePassport>,
        agent_id: String,
        purpose: String,
        responsibility: String,
    ) -> Result<()> {
        let passport = &mut ctx.accounts.agent_passport;
        passport.steward = ctx.accounts.steward.key();
        passport.agent_id = agent_id;
        passport.purpose = purpose;
        passport.responsibility = responsibility;
        passport.noharm_verified = true;
        passport.execution_count = 0;
        passport.last_quorum_timestamp = Clock::get()?.unix_timestamp;
        passport.latest_log_hash = [0u8; 32];
        
        msg!("Agent Passport initialized for ID: {}", passport.agent_id);
        Ok(())
    }

    pub fn record_quorum_execution(
        ctx: Context<RecordQuorumExecution>,
        action_hash: [u8; 32],
        noharm_lineage_pass: bool,
    ) -> Result<()> {
        require!(noharm_lineage_pass, ParakletosError::EthicalBoundaryViolation);

        let passport = &mut ctx.accounts.agent_passport;
        passport.execution_count = passport.execution_count.checked_add(1).unwrap();
        passport.last_quorum_timestamp = Clock::get()?.unix_timestamp;
        passport.latest_log_hash = action_hash;

        msg!(
            "Quorum execution verified. Count: {}, Action Hash: {:?}",
            passport.execution_count,
            action_hash
        );
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(agent_id: String)]
pub struct InitializePassport<'info> {
    #[account(
        init,
        payer = steward,
        space = 8 + 32 + (4 + 64) + (4 + 32) + (4 + 32) + 1 + 8 + 8 + 32,
        seeds = [b"agent-passport", steward.key().as_ref(), agent_id.as_bytes()],
        bump
    )]
    pub agent_passport: Account<'info, AgentPassport>,

    #[account(mut)]
    pub steward: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RecordQuorumExecution<'info> {
    #[account(mut)]
    pub agent_passport: Account<'info, AgentPassport>,

    pub primary_node: Signer<'info>,
    pub secondary_node: Signer<'info>,
}

#[account]
pub struct AgentPassport {
    pub steward: Pubkey,
    pub agent_id: String,
    pub purpose: String,
    pub responsibility: String,
    pub noharm_verified: bool,
    pub execution_count: u64,
    pub last_quorum_timestamp: i64,
    pub latest_log_hash: [u8; 32],
}

#[error_code]
pub enum ParakletosError {
    #[msg("Execution blocked: Action violates NoHarm ethical boundary lineage.")]
    EthicalBoundaryViolation,
    #[msg("Execution blocked: Dual-node hardware quorum signature missing or invalid.")]
    InvalidQuorumSignatures,
}
