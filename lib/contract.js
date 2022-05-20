import crypto from 'crypto'
import { MongoClient } from "mongodb";
import { ethers } from "ethers";

let uri = 'mongodb+srv://testwalletdb:Test1234@cluster0.vcg6q.mongodb.net/walletdb?retryWrites=true&w=majority';

export async function getContractDetails(contract_type) {
    // Here you should create the wallet and save the salt and hashed privatekey and mnemonic (some dbs may have
    // authentication methods that will do it for you so you don't have to worry about it):
  
    var response;
    try {
        const filter = {
            contract_type : contract_type
        };
        const client = await MongoClient.connect(uri);
        const db = await client.db('walletdb');
        const resp = await db.collection('contracts').findOne(filter);
        response = await resp;       
        client.close();
        if (response) return response;
    } catch (exc) {
      console.log(exc)
    }
  
    // return
  }