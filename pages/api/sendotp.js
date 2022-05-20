import { sendOTP } from '../../lib/otp';
import {findUser, createUser} from '../../lib/user'

export default async function sendotp(req, res) {
  try {
    var user = await findUser(req.body);
    const isLogin = req.body.isLogin;
    if (!user && !isLogin) {
      const otpStatus = await sendOTP(req.body)
      res.status(200).json(otpStatus)
    } else if (user && !isLogin) {
      res.status(409).end('User already exists. Please log in to continue.')
    } else if (!user && isLogin) {
      res.status(404).end('User doesn\'t exist. Please sign up first.')
    } else {
      const otpStatus = await sendOTP(req.body)
      user = await createUser(otpStatus);
      res.status(200).json(otpStatus)
    }
  } catch (error) {
    console.error(error)
    res.status(500).end('Authentication token is invalid, please log in')
  }
}
