use borsh::{ BorshDeserialize, BorshSerialize };
use solana_program::{
    account_info::{ AccountInfo, next_account_info },
    entrypoint::ProgramResult, 
    program::invoke,
    pubkey::Pubkey,
    rent::Rent,
    system_instruction,
    system_program,
    sysvar::Sysvar,
};

use crate::state::CertificateInfo;


pub fn create_certificate_info(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    certificate_info: CertificateInfo,
) -> ProgramResult {

    let accounts_iter = &mut accounts.iter();
    let certificate_info_account = next_account_info(accounts_iter)?;
    let payer = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;

    let account_span = (certificate_info.try_to_vec()?).len();
    let lamports_required = (Rent::get()?).minimum_balance(account_span);

    invoke(
        &system_instruction::create_account(
            &payer.key,
            &certificate_info_account.key,
            lamports_required,
            account_span as u64,
            program_id,
        ),
        &[
            payer.clone(), certificate_info_account.clone(), system_program.clone()
        ]
    )?;
    
    certificate_info.serialize(&mut &mut certificate_info_account.data.borrow_mut()[..])?;
    Ok(())
}