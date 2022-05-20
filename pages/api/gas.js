import * as Web3 from 'web3';
import { getContractDetails } from "../../lib/contract"

const ethNetwork = "https://ropsten.infura.io/v3/d38339c7e2d848f58a8a9bca9eeb3d5a";

export default async function gas(req, res) {
  if(req.body.amount === '') return
//   try {
//     // const wallet = await findWallet(req.body)
//     const web3 = new Web3(new Web3.providers.HttpProvider(ethNetwork));
//     const gasPrice = await web3.eth.getGasPrice();
//     console.log("gasPrice is:", gasPrice);

//     res.status(200).send(gasPrice)
//   } catch (error) {
//     console.error(error)
//     res.status(500).end('Wallet details not available. Please try again later!')
//   }
const web3 = new Web3(new Web3.providers.HttpProvider(ethNetwork));
  try {
      // console.log("body is:", req.body);
    var gasUsage, gasPrice, response;
    const contract = await getContractDetails("dex")
    const abi = await contract.contract_abi;
    const contract_address = await contract.contract_address;
    const smartContract = new web3.eth.Contract(abi, contract_address);
    if(req.body.input_token === 'ETH') {
        // console.log("in if");
        gasUsage = await smartContract.methods.buy().estimateGas({from: req.body.account_address, value:web3.utils.toWei(req.body.amount.toString(), "ether")});
        gasPrice = await web3.eth.getGasPrice();
        // console.log("gasPrice and gasUsage is:", gasPrice, gasUsage);
        // console.log("total gas is:", gasPrice * gasUsage);
    } else {
        // console.log("in else");
        gasUsage = await smartContract.methods.sell(web3.utils.toWei(req.body.amount.toString(), "ether")).estimateGas({from: req.body.account_address});
        gasPrice = await web3.eth.getGasPrice();
        // console.log("gasPrice and gasUsage is:", gasPrice, gasUsage);
        // console.log("total gas is:", gasPrice * gasUsage);
    }
    response = gasPrice*gasUsage;
    // console.log("response is:", response);
    res.status(200).json(response)
  } catch (error) {
    console.error(error)
    res.status(500).end('Something went wrong while submitting your transaction. Please try again later!')
  }
}
