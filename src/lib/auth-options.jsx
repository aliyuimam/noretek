
import { connectDB } from "./mongodb";
import Credentials from "next-auth/providers/credentials";
import { User, Wallet } from "../models/models";

export const authOptions = {
  providers: [
    Credentials({
      name: "Email Only (Demo)",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase();
        if (!email) return null;
        await connectDB();
        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({ email, name: email.split("@")[0] });
          await Wallet.create({ userEmail: email, balance: 0 });
        }
        return { id: user._id.toString(), email: user.email, name: user.name };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {},
};
