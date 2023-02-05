import {
    Connection,
    Keypair,
    PublicKey,
} from '@solana/web3.js';
import * as borsh from "borsh";
import { Buffer } from "buffer";


function createKeypairFromFile(path: string): Keypair {
    return Keypair.fromSecretKey(
        Buffer.from(JSON.parse(require('fs').readFileSync(path, "utf-8")))
    )
};


describe("Account Data!", () => {

    const connection = new Connection(`http://localhost:8899`, 'confirmed');
    const payer = createKeypairFromFile(require('os').homedir() + '/.config/solana/id.json');
    const PROGRAM_ID: PublicKey = new PublicKey(
        "HMR8T6SjdTmiqe1MyXS5uhyBUW28Fv5Z42Dz91dZz3hj"
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
                ['registration', 'u8'], 
                ['state', 'string'],
            ],
        }]
    ]);
    
  

    it("Read the new account's data", async () => {

        const ACCOUNT_KEY: PublicKey = new PublicKey("DxxCU9Ri1RfWPwdT6gVysURPV7rbckbbfa5HKPbbxY5S");
        
        const accountInfo = await connection.getAccountInfo(ACCOUNT_KEY);
        const readCertificateInfo = CertificateInfo.fromBuffer(accountInfo.data);
        console.log(`Name            : ${readCertificateInfo.name}`);
        console.log(`Registration Num: ${readCertificateInfo.registration}`);
        console.log(`state           : ${readCertificateInfo.state}`);
    });
});