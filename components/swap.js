import { useEffect, useState } from 'react';
import validator from 'validator';

const Swap = ({ walletData, successMessage, errorMessage, onSubmit }) => {
  
  const [amount, setAmount] = useState("");
  const [gas, setGas] = useState("");
  const [error, setError] = useState("");
  const [selectInput, setSelectInput] = useState("ETH");
  const [selectOutput, setSelectOutput] = useState("RMDSTT");

  useEffect(() => {
    selectInput === "ETH" ? setSelectOutput("RMDSTT") : setSelectOutput("ETH");
  }, [selectInput, selectOutput]);

  useEffect(() => {
      const isValidAmount = validator.isFloat(amount) && amount != 0;
      if (!isValidAmount && amount) {
        setError("Amount is invalid! Only numeric or decimal values are allowed");
      } else {
          if ((amount*(10**18) > walletData.accountBalance) && amount && selectInput === "ETH") {
            setError("Insufficient funds! Please recharge your wallet.");
          } else if ((amount*(10**18) > walletData.tokenBalance) && amount && selectInput === "RMDSTT") {
            setError("Insufficient funds! Please buy some tokens first.");
          } else {
            setError("");
            getGasPrice();
          }
      }
    //   !isValidAmount && amount ? 
    //   setError("Amount is invalid! Only numeric or decimal values are allowed") : 
    //   (amount*(10**18) > walletData.balance) && amount ? setError("Insufficient funds! Please recharge your wallet.") : setError("");      
  }, [amount, selectInput])

  const getGasPrice = async () => {
    try {
        const body = {
            amount: amount,
            input_token: selectInput,
            account_address: walletData.account_address,
        }

        const res = await fetch('/api/gas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const res_text = await res.text();
        if (res.status === 200) {
            setGas(res_text);
            console.log("gas price is:", res_text, res_text/10**18);
        } else {
          throw new Error(await res.text())
        }
      } catch (error) {
        console.error('An unexpected error happened occurred:', error)
      }
  };

  return (
    <div>
        {/* <div className="balance">Account Balance: {(walletData.accountBalance/10**18).toFixed(4)} ETH</div>
        <div className="balance">Token Balance: {(walletData.tokenBalance/10**18).toFixed(4)} RMDSTT</div> */}
        <table>
            <tr>
                <td className="heading">Account Balance</td>
                <td>{(walletData.accountBalance/10**18).toFixed(4)}</td>
                <td className="heading">ETH</td>
            </tr>
            <tr>
                <td className="heading">RMDSTT Token Balance</td>
                <td>{(walletData.tokenBalance/10**18).toFixed(4)}</td>
                <td className="heading">RMDSTT</td>
            </tr>
        </table>
        <br />
        <form onSubmit={onSubmit}>
            <select name="input_token" defaultValue={selectInput} onChange={(e) => setSelectInput(e.target.value)}>
                <option value="ETH">ETH</option>
                <option value="RMDSTT">RMDSTT</option>
            </select>
            <input inputMode="decimal" pattern="^[0-9]*[.,]?[0-9]*$" type="text" minLength="1" maxLength="17" name="input_amount" onChange={(e) => setAmount(e.target.value)} placeholder="0.0" required />
            <select name="output_token" value={selectOutput} disabled>
                <option value="ETH">ETH</option>
                <option value="RMDSTT">RMDSTT</option>
            </select>
            <input inputMode="decimal" type="text" minLength="1" maxLength="17" name="transfer_amount" value={amount} placeholder="0.0" disabled />
            {/* <br /> */}
            {
                amount && !error ? (
                    <>
                        <table>
                            <tr>
                                <td className="heading">Transaction fee(Approx.)</td>
                                <td>{(gas/10**18).toFixed(4)}</td>
                                <td className="heading">ETH</td>
                            </tr>
                            <tr>
                                <td className="heading">Total amount(Approx.)</td>
                                {selectInput === "ETH" ? 
                                    (<>
                                    <td>{(parseFloat(amount) + gas/10**18).toFixed(4)}</td>
                                    <td className="heading">ETH</td>
                                    </>) : 
                                    (<>
                                    <td>{amount}</td>
                                    <td className="heading">RMDSTT</td>
                                    <td className="heading">+</td>
                                    <td>{(gas/10**18).toFixed(4)}</td>
                                    <td className="heading">ETH</td>
                                    </>
                                    )
                                }                                
                            </tr>
                        </table>
                        <br />
                    </>
                ) : (<></>)
            }
            <div className="submit">
                {amount && !error && !errorMessage ? <button type="submit">Submit</button> : <button type="submit" disabled>Submit</button>}
            </div>

          {errorMessage && <p className="error">{errorMessage}</p>}
          {error && <p className="error">{error}</p>}

          {successMessage && <p className="success">{successMessage}</p>}
        </form>
        <style jsx>{`
            form,
            label,
            select {
              display: flex;
              flex-flow: column;
              font-weight: 800;
              font-size: large;
              border:none;
            }
            label > span {
              font-weight: 600;
            }
            select > option {
                font-weight: 800;
                font-size: large;
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
            .success {
                color: green;
                margin: 1rem 0 0;
            }
            .balance {
                font-size: large;
                font-weight: 800;
            }
            .heading {
                font-size: medium;
                font-weight: 600;
            }
          `}</style>
    </div>
  )
}

export default Swap
