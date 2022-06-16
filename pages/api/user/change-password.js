import { getSession } from "next-auth/react";
import { hashPassword, verifyPassword } from "../../../lib/auth";
import { connectToDatabase } from "../../../lib/db";

const ChangePasswordHandler = async (req, res) => {
  if (!req.method === "PATCH") {
    return;
  }
  const session = await getSession({ req: req });
  if (!session) {
    res.status(401).json({ massege: "not authenticated" });
    return;
  }
  const userEmail = session.user.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  const client = await connectToDatabase();
  const usersCollection = client.db("next-auth").collection("users");
  const user = await usersCollection.findOne({ email: userEmail });
  if (!user) {
    res.status(404).json({ message: "user not found" });
    client.close();
    return;
  }
  const currentPassword = user.password;
  const isValid = await verifyPassword(oldPassword, currentPassword);
  if (!isValid) {
    res.status(403).json({ massege: "User password does not match" });
    client.close;
    return;
  }
  const hashedPassword = await hashPassword(newPassword);

  const result = await usersCollection.updateOne(
    { email: userEmail },
    { $set: { password: hashedPassword } }
  );
  res.status(200).json({ message: "password changed" });
  client.close();
};

export default ChangePasswordHandler;
