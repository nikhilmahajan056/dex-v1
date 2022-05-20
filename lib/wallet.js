import crypto from 'crypto'
import { MongoClient } from "mongodb";
import { ethers } from "ethers";

let uri = 'mongodb+srv://testwalletdb:Test1234@cluster0.vcg6q.mongodb.net/walletdb?retryWrites=true&w=majority';

export async function createWallet(user_id) {
  // Here you should create the wallet and save the salt and hashed privatekey and mnemonic (some dbs may have
  // authentication methods that will do it for you so you don't have to worry about it):

  var resp;
  try {
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    const response = ethers.Wallet.createRandom();
    // let account_address = cipher.update(response.address);
    // account_address = Buffer.concat([account_address, cipher.final()]);
    // let private_key = cipher.update(response.privateKey);
    // private_key = Buffer.concat([private_key, cipher.final()]);
    let account_address = response.address;
    let private_key = response.privateKey;
    let mnemonic = cipher.update(response.mnemonic["phrase"]);
    mnemonic = Buffer.concat([mnemonic, cipher.final()]);
    
    const wallet = {
      createdAt: Date.now(),
      user_id : user_id,
      key: key.toString('hex'),
      iv: iv.toString('hex'),
      account_address: account_address.toString('hex'),
      private_key: private_key.toString('hex'),
      mnemonic: mnemonic.toString('hex')
    };

    // console.log("wallet in lib wallet is:", wallet);

    const client = await MongoClient.connect(uri);
    const db = await client.db('walletdb');
    const result = await db.collection('wallets').insertOne(wallet)
    client.close();
  } catch (exc) {
    console.log(exc)
  }

  return { user_id, createdAt: Date.now() }
}

export async function findWallet({user_id}) {
    // Here you should create the wallet and save the salt and hashed privatekey and mnemonic (some dbs may have
    // authentication methods that will do it for you so you don't have to worry about it):
  
    var response, account_address, private_key, mnemonic;
    try {

        var filter = {
            user_id: user_id,
        };

        const client = await MongoClient.connect(uri);
        const db = await client.db('walletdb');
        const resp = await db.collection('wallets').findOne(filter);
        const result = await resp;       
        client.close();       
        let iv = Buffer.from(result.iv, 'hex');
        let key = Buffer.from(result.key, 'hex');
        let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
        let encryptedMnemonic = Buffer.from(result.mnemonic, 'hex');
        let decryptedMnemonic = decipher.update(encryptedMnemonic);
        mnemonic = Buffer.concat([decryptedMnemonic, decipher.final()]);
        // let encryptedAccountAddress = Buffer.from(result.account_address, 'hex');
        // let decryptedAccountAddress = decipher.update(encryptedAccountAddress);
        // account_address = Buffer.concat([decryptedAccountAddress, decipher.final()]);
        // let encryptedPrivateKey = Buffer.from(result.private_key, 'hex');        
        // let decryptedPrivateKey = decipher.update(encryptedPrivateKey);
        // private_key = Buffer.concat([decryptedPrivateKey, decipher.final()]);
        account_address = result.account_address.toString();
        private_key = result.private_key.toString()
        response = { account_address: account_address, private_key: private_key, mnemonic: mnemonic.toString() };
        if (response) return response;
    } catch (exc) {
      console.log(exc)
    }
  
    // return
  }