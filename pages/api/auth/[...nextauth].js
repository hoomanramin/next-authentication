import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {verifyPassword} from "../../../lib/auth";
import {connectToDatabase} from "../../../lib/db";

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    CredentialsProvider({
      // name: 'Credentials',

      // credentials: {
      //   email: { label: "Email", type: "text", placeholder: "jsmith" },
      //   password: {  label: "Password", type: "password" }
      // },
      async authorize(credentials) {
        const client = await connectToDatabase();
        const usersCollection = client.db("next-auth").collection("users");
        const user = await usersCollection.findOne({email: credentials.email});

        if (!user) {
          client.close();
          throw new Error("no user found");
        }
        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          client.close();
          throw new Error("Could not login");
        }

        client.close();
        return {email: user.email};
      },
    }),
  ],
});
