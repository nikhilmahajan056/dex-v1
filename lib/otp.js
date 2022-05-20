import crypto from 'crypto'
import {MongoClient} from 'mongodb'
import {findUser, createUser} from './user'

let uri = 'mongodb+srv://testwalletdb:Test1234@cluster0.vcg6q.mongodb.net/walletdb?retryWrites=true&w=majority';
const accountSid = 'ACfa10d2901a1a32c5705c4f6123cf46fe';
const authToken = '5a481cf9fbe91fa3f382414f2f5aa94b';

/*
export async function sendOTP({username}) {
    // Here you should create the user and save the salt and hashed otp (some dbs may have
    // authentication methods that will do it for you so you don't have to worry about it):
  
    var resp;
    try {
      
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        console.log(otp);

        const filter = {
            "username" : username
          };
          
        const client = await MongoClient.connect(uri);
        const db = await client.db('walletdb');
        const result = await db.collection('users').findOne(filter)
        resp = result;
        console.log(result)
        if (resp) {
            // var msg = 'Your One-Time Password (OTP) is ' + otp + ' for wallet app login. The OTP is valid only one. Please do not share this password with anyone.';
            // const client = require('twilio')(accountSid, authToken);
            // await client.messages.
            // create({
            //     body: msg,
            //     from: '+19894558683',
            //     to: '+919405178044' // '+91' + username
            // })
            // .then(async(message) => {
                // console.log(message.sid);
                const salt = crypto.randomBytes(16).toString('hex')
                const hash = crypto
                  .pbkdf2Sync(otp, salt, 1000, 64, 'sha512')
                  .toString('hex')
            
                const updateDoc = {
                    $set: {
                        OtpCreatedAt: Date.now(),
                        hash: hash,
                        salt: salt,
                    },
                };

                await db.collection('users').updateOne(filter, updateDoc)
                .then(result => {
                    console.log("result is:", result);
                    resp = result;
                })
                .catch(exc => console.log(exc))
            // });
        }
        if (resp) return { username, otp: otp, otpCreatedAt: Date.now() }
    } catch (exc) {
      console.log(exc)
    }
  
    return 
  }
  */

export async function sendOTP({username}) {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(otp);
    /*
    var msg = 'Your One-Time Password (OTP) is ' + otp + ' for wallet app login. The OTP is valid only one. Please do not share this password with anyone.';
    const client = require('twilio')(accountSid, authToken);
    await client.messages.
    create({
        body: msg,
        from: '+19894558683',
        to: '+919405178044' // '+91' + username
    })
    .then(async(message) => {
        console.log(message.sid);
    });
    */
    return { username, password: otp, otpCreatedAt: Date.now() }
}