import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../../models/User";
import clientPromise from "../../../../old-pages/api/auth/lib/mongodb";
import bcrypt from "bcrypt";
import db from "../../../../utils/db";
import { sendWelcomeEmail } from "../../../../utils/sendWelcomeEmail";

// Define the SignInUser function
const SignInUser = async ({ email, password }) => {
  // Ensure database connection is established
  await db.connectDb();

  // Check if the user exists in the database
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("email no encotrado.");
  }

  // Check if the password matchess
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("email o contraseña invalidos!");
  }

  return user;
};

// Define authOptions
export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Use the SignInUser function to verify credentials
        try {
          const user = await SignInUser(credentials);
          return user; // If successful, return the user object
        } catch (error) {
          throw new Error(error.message); // Handle any errors
        }
      },
    }),
  ],
  events: {
    /**
     * signIn is called after a user signs in:
     * - `user` is the user object
     * - `isNewUser` is `true` if the user signed up for the first time (OAuth only)
     */
    async signIn({ user, account, profile, isNewUser }) {
      if (isNewUser && account.provider === "google") {
        // Send welcome email
        await sendWelcomeEmail(user.email, user.name);

        // Also update the user doc to store provider = 'google'
        await db.connectDb();
        await User.findByIdAndUpdate(user.id, { provider: "google" });
        await db.disconnectDb();
      }
    },
  },
  callbacks: {
    async jwt({ token, trigger, session, user, account }) {
      await db.connectDb();
      if (trigger === "update" && session?.role) {
        token.role = session.role;
      } else {
        let user = await User.findById(token.sub);
        token.role = user?.role || token.role;
      }
      if (trigger === "update" && session?.image) {
        token.picture = session.image;
      } else {
        let user = await User.findById(token.sub);
        token.picture = user?.image || token.picture;
      }
      if (trigger === "update" && session?.password) {
        token.password = session.password;
      } else {
        let user = await User.findById(token.sub);
        token.password = user?.password || token.password;
      }
      if (user && account) {
        // If this is the first time the JWT is being created
        token.provider = user.provider || "credentials";
        token.password = user.password;
      }
      await db.disconnectDb();
      return token;
    },
    async session({ session, token }) {
      await db.connectDb();
      const user = await User.findById(token.sub).lean();
      session.user.id = token.sub || user?._id.toString();
      session.user.role = user?.role || "user";
      session.user.image = token.picture;
      session.user.employee =
        token.bussinesBankAccountNumber || user?.bussinesBankAccountNumber;
      session.user.provider = token.provider;
      session.user.password = token.password;
      session.user.address = user.address;
      await db.disconnectDb();
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.JWT_SECRET,
};

// Use authOptions in NextAuth handler
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
