import { createUser } from '../../lib/user'
import { createWallet } from '../../lib/wallet'

export default async function signup(req, res) {
  try {
    const user = await createUser(req.body)
    if (user.id) {
      const wallet = await createWallet(user.id);
      if (wallet) res.status(200).send({ done: true })
    } else {
      res.status(409).end("User already exists!")
    }
  } catch (error) {
    console.error(error)
    res.status(500).end(error.message)
  }
}
