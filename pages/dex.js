import { useUser } from '../lib/hooks'
import Layout from '../components/layout'
import { useEffect, useState } from 'react'
import Swap from '../components/swap' 
import * as Web3 from 'web3'

const DEX = () => {
  const user = useUser({ redirectTo: '/login' })
  const ethNetwork = "https://ropsten.infura.io/v3/d38339c7e2d848f58a8a9bca9eeb3d5a";
  const etherscanLink = "https://ropsten.etherscan.io";

  const [walletData, setWalletData] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(async () => {
    if (user) {
      const body = {
        user_id: JSON.parse(JSON.stringify(user))._id,
      }
  
      try {
        const res = await fetch('/api/wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const res_json = await res.json();
        if (res.status === 200) {
          const balance = await getBalance(res_json.account_address);
          res_json.accountBalance = balance.accountBalance;
          res_json.tokenBalance = balance.tokenBalance;
          setWalletData(res_json);
        } else {
          throw new Error(await res.text())
        }
      } catch (error) {
        console.error('An unexpected error happened occurred:', error)
      }
    }
  }, [user, errorMsg]);

  // const getBalance = async (account_address) => {
  //   const web3 = new Web3(new Web3.providers.HttpProvider(ethNetwork));
  //   let balance;
  //   await web3.eth.getBalance(account_address)
  //   .then((res) => {
  //     console.log("res is:", res);
  //     balance = res;
  //   });
  //   return balance;
  // };

  const getBalance = async (account_address) => {
    try {
      const body = {
        account_address: account_address
      }
      const res = await fetch('/api/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const res_json = await res.json();
      if (res.status === 200) {
        return res_json;
      } else {
        throw new Error(await res.text())
      }
    } catch (error) {
      console.error('An unexpected error happened occurred:', error)
    }
  };

  async function handleSubmit(e) {
    e.preventDefault()

    if (errorMsg) setErrorMsg('')

    const body = {
      input_token: e.currentTarget.input_token.value,
      output_token: e.currentTarget.output_token.value,
      amount: e.currentTarget.input_amount.value,
      account_address: walletData.account_address,
      private_key: walletData.private_key,
    }

    try {
      setErrorMsg('Transaction is in process. Do not refresh this page!');
      const res = await fetch('/api/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const res_json = await res.json();
      if (res.status === 200) {
        // Router.push('/dex')
        const hash = res_json.hash;
        setSuccessMsg("Transaction submitted successfully. For more details, please check " + etherscanLink +"/tx/" + hash);
        setErrorMsg('')
      } else {
        throw new Error(await res.text())
      }
    } catch (error) {
      console.error('An unexpected error happened occurred:', error)
      setErrorMsg(error.message)
    }
  }

  return (
    <>
    {user && (
      <>
        <Layout>
          <h1>Swap</h1>
          <div className="dex">
            <Swap walletData={walletData} successMessage={successMsg} errorMessage={errorMsg} onSubmit={handleSubmit} />
          </div>
          <style jsx>{`
            .dex {
              max-width: 21rem;
              margin: 0 auto;
              padding: 1rem;
              border: 1px solid #ccc;
              border-radius: 4px;
            }
          `}</style>
        </Layout>
      </>
    )}
    </>
  )
}

export default DEX