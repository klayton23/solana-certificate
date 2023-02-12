import {
    Connection,
    Keypair,
    PublicKey,
    sendAndConfirmTransaction,
    SystemProgram,
    Transaction,
    TransactionInstruction,
} from '@solana/web3.js';
import * as borsh from "borsh";
import { Buffer } from "buffer";


function createKeypairFromFile(path: string): Keypair {
    return Keypair.fromSecretKey(
        Buffer.from(JSON.parse(require('fs').readFileSync(path, "utf-8")))
    )
};

// function createInfoAccount(certificateData: any, payerPubkey: any, program_id: any): PublicKey {
//     return await PublicKey.createWithSeed(
//         payerPubkey,
//         (certificateData.name + certificateData.registration),
//         program_id,
//     )
// }


describe("Account Data!", () => {

    const connection = new Connection(`http://localhost:8899`, 'confirmed');
    const payer = createKeypairFromFile(require('os').homedir() + '/.config/solana/id.json');
    const PROGRAM_ID: PublicKey = new PublicKey(
        "9cSSpQreGQ2Pb9mAZqLpVJwCxkYpSPNhADRPKWg7zHxM"
    );

    class Assignable {
        constructor(properties) {
            Object.keys(properties).map((key) => {
                return (this[key] = properties[key]);
            });
        };
    };

    class CertificateInfo extends Assignable {
        toBuffer() { return Buffer.from(borsh.serialize(CertificateInfoSchema, this)) }
        
        static fromBuffer(buffer: Buffer) {
            return borsh.deserialize(CertificateInfoSchema, CertificateInfo, buffer);
        };
    };
    const CertificateInfoSchema = new Map([
        [ CertificateInfo, { 
            kind: 'struct', 
            fields: [ 
                ['name', 'string'], 
                ['registration', 'u32'], 
                ['state', 'string'],
            ],
        }]
    ]);

    const certificateData = (
        new CertificateInfo({
            name: "Klayton",
            registration: 201609817,
            state: "Graduated",
        })
    );

    const certificateInfoAccount = Keypair.generate();
    //const certificateInfoAccount = await createInfoAccount(payer.publicKey, certificateData, PROGRAM_ID);
    console.log(certificateInfoAccount.publicKey.toBase58());
    console.log(payer.publicKey.toBase58());
    console.log(SystemProgram.programId.toBase58());
    
    it("Create the certificate info account", async () => {
        console.log(`Payer Address      : ${payer.publicKey}`);
        console.log(`Certificate Info Acct  : ${certificateInfoAccount.publicKey}`);
        let ix = new TransactionInstruction({
            keys: [
                {pubkey: certificateInfoAccount.publicKey, isSigner: true, isWritable: true},
                {pubkey: payer.publicKey, isSigner: true, isWritable: true},
                {pubkey: SystemProgram.programId, isSigner: false, isWritable: false}
            ],
            programId: PROGRAM_ID,
            data: certificateData.toBuffer(),
        });
        await sendAndConfirmTransaction(
            connection, 
            new Transaction().add(ix),
            [payer, certificateInfoAccount]
        );
    });

    it("Read the new account's data", async () => {
        // console.log(`Certificate pubKey : ${certificateInfoAccount.publicKey}`);
        //certificateInfoAccount
        // const ACCOUNT_KEY: PublicKey = new PublicKey("DxxCU9Ri1RfWPwdT6gVysURPV7rbckbbfa5HKPbbxY5S");
        
        const accountInfo = await connection.getAccountInfo(certificateInfoAccount.publicKey);
        const readCertificateInfo = CertificateInfo.fromBuffer(accountInfo.data);
        console.log(`Name            : ${readCertificateInfo.name}`);
        console.log(`Registration Num: ${readCertificateInfo.registration}`);
        console.log(`state           : ${readCertificateInfo.state}`);
    });
});