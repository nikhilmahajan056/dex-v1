import { useUser } from '../lib/hooks'
import Layout from '../components/layout'
import { useEffect, useState } from 'react'

const Profile = () => {
  const user = useUser({ redirectTo: '/login' })
  
  const [walletData, setWalletData] = useState({});

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
          setWalletData(res_json);
        } else {
          throw new Error(await res.text())
        }
      } catch (error) {
        console.error('An unexpected error happened occurred:', error)
      }
    }
  }, [user]);

  return (
    <>
    {user && (
      <>
        <Layout>
          <h1>Wallet details</h1>
          <table>
            <tr>
              <td className="heading">Account Address</td>
              <td>:</td>
              <td>{walletData.account_address}</td>
            </tr>
            <br/>
            <tr>
              <td className="heading">Private Key</td>
              <td>:</td>
              <td>{walletData.private_key}</td>
            </tr>
            <br/>
            <tr>
              <td className="heading">Seed Phrase</td>
              <td>:</td>
              <td>{walletData.mnemonic}</td>
            </tr>
          </table>
          {/* <pre>{JSON.stringify(walletData, null, 2)}</pre> */}
        
          <style jsx>{`
            pre {
              white-space: pre-wrap;
              word-wrap: break-word;
            }
            table {
              flex-flow: column;
              font-size: large;
              border:none;
            }
            .heading {
              font-weight: 600;
            }
          `}</style>
        </Layout>
      </>
    )}
    </>
  )
}

export default Profile
