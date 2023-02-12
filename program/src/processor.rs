use borsh::{ BorshDeserialize, BorshSerialize };
use solana_program::{
    account_info::{ AccountInfo, next_account_info }, 
    entrypoint::ProgramResult, 
    msg,
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

    // Iterating accounts is safer than indexing
    let accounts_iter = &mut accounts.iter();
    next_account_info(accounts_iter)?;
    // Get the account to say hello to
    let account = next_account_info(accounts_iter)?;
    // let specifiedOwnerPubKey: [u8] = 9AmAf13Bnb5nxUCfGNDyTWEX71EikAxfvd6ZBnbHAn7h;
    // let owner: [u8] = account.owner;

    // The account must be owned by the program in order to modify its data
    
    // if account.owner != account {
    //     msg!("Owner account: {}", account.owner);
    //     msg!("Program id: {}", program_id);
    //     //msg!("Account does not have the correct program id");
    //     //return Err(ProgramError::IncorrectProgramId);
    // }

    match CertificateInfo::try_from_slice(&instruction_data) {
        Ok(certificate_info) => return instructions::create::create_certificate_info(
            program_id, accounts, certificate_info
        ),
        Err(_) => {},
    };

    Err(ProgramError::InvalidInstructionData)
}