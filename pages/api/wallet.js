import { findWallet } from "../../lib/wallet"

export default async function wallet(req, res) {
  try {
    const wallet = await findWallet(req.body)
    res.status(200).json(wallet)
  } catch (error) {
    console.error(error)
    res.status(500).end('Wallet details not available. Please try again later!')
  }
}
