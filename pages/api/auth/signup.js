import { hashPassword } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";

const SignupHandler = async (req, res) => {
  if (req.method === 'POST') {
    const data = req.body
    const { email, password } = data
    if (!email || !password || !email.includes('@') || !password.trim().length > 7) {
      res.status(422).json({ message: 'password should have 7 character' })
      return
    }

    const client = await connectToDatabase()
    const db = client.db('next-auth')

    const existingUser = await db.collection('users').findOne({ email: email })
    if (existingUser) {
      res.status(422).json({ message: 'your username is exist' })
      return
    }

    const hashedPassword = await hashPassword(password)

    const result = await db.collection('users').insertOne({
      email: email,
      password: hashedPassword
    });
    res.status(201).json({ message: 'user Created' })
  }

};

export default SignupHandler;
