import * as Web3 from "web3";
import { getContractDetails } from "../../lib/contract"

const ethNetwork = "https://ropsten.infura.io/v3/d38339c7e2d848f58a8a9bca9eeb3d5a";

export default async function transfer(req, res) {
  const web3 = new Web3(new Web3.providers.HttpProvider(ethNetwork));
  try {
    var response, transaction;
    const contract = await getContractDetails("dex")
    const abi = await contract.contract_abi;
    const contract_address = await contract.contract_address;
    const smartContract = new web3.eth.Contract(abi, contract_address);
    // const contractEncodeABI = req.body.input_token === 'ETH' ? smartContract.methods.buy().encodeABI() : smartContract.methods.sell(web3.utils.toWei(req.body.amount.toString(), "ether")).encodeABI();
    if(req.body.input_token === 'ETH') {
        transaction = {
            gas: 300000,
            from: req.body.account_address,
            to: contract_address,
            value: web3.utils.toWei(req.body.amount.toString(), "ether"),
            data: smartContract.methods.buy().encodeABI()
        };
    } else {
        transaction = {
            gas: 300000,
            from: req.body.account_address,
            to: contract_address,
            data: smartContract.methods.sell(web3.utils.toWei(req.body.amount.toString(), "ether")).encodeABI()
        };
    }
    
    const signedTx = await web3.eth.accounts.signTransaction(transaction, req.body.private_key);
    // web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {
    //     if (!error) {
    //         response = {
    //             hash
    //         };
    //       console.log("🎉 The hash of your transaction is: ", hash, "\n Check Alchemy's Mempool to view the status of your transaction!");
    //     } else {
    //       console.log("❗Something went wrong while submitting your transaction:", error)
    //       throw(error);
    //     }
    // });
    var hash = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    response = {
        hash: hash.transactionHash,
    };

    res.status(200).json(response)
  } catch (error) {
    console.error(error)
    res.status(500).end('Something went wrong while submitting your transaction. Please try again later!')
  }
}
