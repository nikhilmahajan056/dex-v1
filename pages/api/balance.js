import * as Web3 from "web3";
import { getContractDetails } from "../../lib/contract"

const ethNetwork = "https://ropsten.infura.io/v3/d38339c7e2d848f58a8a9bca9eeb3d5a";

export default async function balance(req, res) {
    var balance;
  try {
    const web3 = new Web3(new Web3.providers.HttpProvider(ethNetwork));
    const accountBalance = await web3.eth.getBalance(req.body.account_address);
    
    const contract = await getContractDetails("token")
    const abi = await contract.contract_abi;
    const contract_address = await contract.contract_address;
    const smartContract = new web3.eth.Contract(abi, contract_address);
    const tokenBalance = await smartContract.methods.balanceOf(req.body.account_address).call();
    balance = {
        accountBalance: accountBalance,
        tokenBalance : tokenBalance,
    };
    res.status(200).json(balance)
  } catch (error) {
    console.error(error)
    res.status(500).end('Something went wrong while submitting your transaction. Please try again later!')
  }
}
