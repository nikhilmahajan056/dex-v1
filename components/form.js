import Link from 'next/link'
import { useEffect, useState } from 'react';
import validator from 'validator' 

const Form = ({ isLogin, errorMessage, onSubmit }) => {
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(isLogin);

  useEffect(()=> {
    setOtpSent(false);
    setOtp("");
    setError("");
    setStatus(isLogin);
    if (username) {
      const isvalid = validatePhoneNumber(username);
      if (!isvalid) setError("Mobile number is invalid!") 
    }
  },[username])

  useEffect(() => {
    setError("");
    if (password && (password !== otp)) {
      setError("OTP is invalid!");
    }
  }, [password, otp]);

  const validatePhoneNumber = (number) => {
    const isValidPhoneNumber = validator.isMobilePhone(number, 'en-IN')
    return isValidPhoneNumber;
   }

  const sendOTP = async (e) => {
    e.preventDefault();
    setOtpSent(false);
    setOtp("");
    setError("");
    const body = {
      username: username,
      isLogin: status
    }

    const res = await fetch('/api/sendotp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.status === 200) {
      const res_json = await res.json();
      setOtpSent(true);
      setOtp(res_json.password);
    } else if (res.status === 404) {
      setError('User doesn\'t exist. Please sign up first.')
    } else if (res.status === 409) {
      setError('User already exists. Please log in to continue.')
    } else {
      setOtpSent(false);
      throw new Error(await res.text())
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <label>
        <span>Mobile Number</span>
        <input type="text" maxLength={10} name="username" onChange={(e) => setUsername(e.target.value)} required />
      </label>
      {username && !otpSent && !error && (
        <button onClick={sendOTP}>Send OTP</button>
      )}
      {otpSent && (
        <label>
          <span>Enter OTP</span>
          <input type="password" name="password" onChange={(e) => setPassword(e.target.value)} required />
        </label>
      )}
      {/* {!isLogin && (
        <label>
          <span>Repeat password</span>
          <input type="password" name="rpassword" required />
        </label>
      )} */}

      <div className="submit">
        {isLogin ? (
          <>
            <Link href="/signup">
              <a>I don't have an account</a>
            </Link>
            {(otpSent && !error) ? <button type="submit">Login</button> : <button type="submit" disabled>Login</button>}
          </>
        ) : (
          <>
            <Link href="/login">
              <a>I already have an account</a>
            </Link>
            {(otpSent && !error) ? <button type="submit">Signup</button> : <button type="submit" disabled>Signup</button>}
          </>
        )}
      </div>

      {errorMessage && <p className="error">{errorMessage}</p>}
      {error && <p className="error">{error}</p>}

      <style jsx>{`
        form,
        label {
          display: flex;
          flex-flow: column;
        }
        label > span {
          font-weight: 600;
        }
        input {
          padding: 8px;
          margin: 0.3rem 0 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .submit {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          justify-content: space-between;
        }
        .submit > a {
          text-decoration: none;
        }
        .submit > button {
          padding: 0.5rem 1rem;
          cursor: pointer;
          background: #fff;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .submit > button:hover {
          border-color: #888;
        }
        .error {
          color: brown;
          margin: 1rem 0 0;
        }
      `}</style>
    </form>
  )
}

export default Form
