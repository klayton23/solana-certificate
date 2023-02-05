use borsh::{ BorshDeserialize, BorshSerialize };
use solana_program::{
    account_info::AccountInfo, 
    entrypoint::ProgramResult, 
    program_error::ProgramError,
    pubkey::Pubkey,
};

use crate::instructions;
use crate::state::CertificateInfo;


pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {

    match CertificateInfo::try_from_slice(&instruction_data) {
        Ok(certificate_info) => return instructions::create::create_certificate_info(
            program_id, accounts, certificate_info
        ),
        Err(_) => {},
    };

    Err(ProgramError::InvalidInstructionData)
}