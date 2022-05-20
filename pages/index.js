import { useUser } from '../lib/hooks'
import Layout from '../components/layout'

const Home = () => {
  const user = useUser()

  return (
    <Layout>
      <h1>Sample Wallet</h1>

      <p>Steps to test the example:</p>

      <ol>
        <li>Click Login and enter a mobile number.</li>
        <li>Now click on send OTP to receive the OTP (One-Time-Password) on the above mobile number.</li>
        <li>Now enter the OTP and click on Login.</li>
        <li>
          After successful OTP verification, you'll be redirected to Home. Click on Profile, to see the wallet credentials.
        </li>
        <li>
          Click Logout and try to go to Profile again. You'll get redirected to
          Login.
        </li>
      </ol>

      {/* {user && (
        <>
          <p>Currently logged in as:</p>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </>
      )} */}

      <style jsx>{`
        li {
          margin-bottom: 0.5rem;
        }
        pre {
          white-space: pre-wrap;
          word-wrap: break-word;
        }
      `}</style>
    </Layout>
  )
}

export default Home
