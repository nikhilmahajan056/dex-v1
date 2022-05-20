import crypto from 'crypto'
// import { v4 as uuidv4 } from 'uuid'
import {MongoClient} from 'mongodb'

/**
 * User methods. The example doesn't contain a DB, but for real applications you must use a
 * db here, such as MongoDB, Fauna, SQL, etc.
 */

const users = []
let uri = 'mongodb+srv://testwalletdb:Test1234@cluster0.vcg6q.mongodb.net/walletdb?retryWrites=true&w=majority';

export async function createUser({ username, password }) {
  // Here you should create the user and save the salt and hashed password (some dbs may have
  // authentication methods that will do it for you so you don't have to worry about it):

  var resp;
  try {
    const salt = crypto.randomBytes(16).toString('hex')
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
      .toString('hex')
    const user = {
      $set: {
        createdAt: Date.now(),
        username,
        hash,
        salt,
      }
    }
    const query = {
      "username" : username
    };
    const options = { upsert: true };

    const client = await MongoClient.connect(uri);
    const db = await client.db('walletdb');
    // let res = await db.collection('users').findOne(query);
    // if(!res) {
    //   const result = await db.collection('users').insertOne(user);
    //   resp = JSON.parse(JSON.stringify(result)).insertedId;
    // }
    let result = await db.collection('users').updateOne(query, user, options);
    resp = JSON.parse(JSON.stringify(result)).upsertedId;
    client.close();
  } catch (exc) {
    console.log(exc)
  }
  return { username, id: resp, createdAt: Date.now() }
}

const getUser = async (username) => {
  try {
    var resp;
    const query = {
      "username" : username
    };

    const client = await MongoClient.connect(uri);
    const db = await client.db('walletdb');
    let res = await db.collection('users').findOne(query);
    resp = await res;
    client.close();
    return resp;
  } catch (exc) {
    console.log(exc);
  }
  return 
};

// Here you should lookup for the user in your DB
export async function findUser({ username }) {
  var user = await getUser(username);
  return await user;
}

// Compare the otp of an already fetched user (using `findUser`) and compare the
// otp for a potential match
export function validatePassword(user, inputPassword) {
  const inputHash = crypto
    .pbkdf2Sync(inputPassword, user.salt, 1000, 64, 'sha512')
    .toString('hex')
  const passwordsMatch = user.hash === inputHash
  return passwordsMatch
}
