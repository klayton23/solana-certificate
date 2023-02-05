use borsh::{ BorshDeserialize, BorshSerialize };


#[derive(BorshDeserialize, BorshSerialize, Debug)]
pub struct CertificateInfo {
    pub name: String,
    pub registration: u8,
    pub state: String,
}

impl CertificateInfo {

    pub fn new(
        name: String,
        registration: u8,
        state: String,
    ) -> Self {
        CertificateInfo {
            name,
            registration,
            state,
        }
    }
}