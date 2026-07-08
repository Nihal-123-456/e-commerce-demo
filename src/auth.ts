import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import connectDb from "./lib/db"
import User from "./models/user.model"
import bcrypt from "bcryptjs"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDb()
        const email = credentials?.email
        const password = credentials?.password

        if (typeof email !== "string" || typeof password !== "string") {
          throw new Error("Invalid credentials")
        }

        const userExist = await User.findOne({ email })
        if(!userExist) {
          throw new Error("User does not exist")
        }

        const isPasswordCorrect = await bcrypt.compare(password, userExist.password)
        if(!isPasswordCorrect) {
          throw new Error("Incorrect password")
        }

        return {
          id: userExist._id.toString(),
          email: userExist.email,
          name: userExist.name,
          role: userExist.role,
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    })
  ],
  callbacks: {
    async signIn({user, account}) {
      if(account?.provider === "google") {
        await connectDb()
        let dbUser = await User.findOne({email: user.email})
        if(!dbUser) {
          dbUser = await User.create({email: user.email, name: user.name, image: user.image})
        }
        user.id = dbUser._id.toString();
        user.role = dbUser.role;
      }
      return true
    },
    jwt({token, user}) {
      if(user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = user.role
      }
      return token
    },
    session({session, token}) {
      if(session.user){
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60 * 1000
  },
  secret: process.env.AUTH_SECRET
})