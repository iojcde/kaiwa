import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions, getServerSession } from "next-auth"
import EmailProvider from "next-auth/providers/email"
import GithubProvider from "next-auth/providers/github"
import { db } from "./db"
import { sendVerificationRequest } from "@/emails/sendVerificationEmail"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/auth/verify-request",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    EmailProvider({
      name: "email",
      server: "",
      from: "auth@kaiwa.jcde.xyz",
      sendVerificationRequest,
    }),
  ],
  callbacks: {
    async jwt({ token, trigger, user }) {
      let dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      })

      if (dbUser.wsToken == null) {
        dbUser = await db.user.update({
          where: { id: dbUser.id },
          data: {
            wsToken: require("crypto").randomBytes(256).toString("base64"),
          },
        })
      }

      if (trigger == "signUp") {
        const invites = await db.invite.findMany({
          where: { email: token.email },
        })

        if (invites.length > 0) {
          await db.access.createMany({
            data: invites.map((invite) => {
              return {
                level: invite.level,
                postId: invite.postId,
                userId: dbUser.id,
              }
            }),
          })
        }
      }

      // if (!dbUser) {
      //   if (user) {
      //     token.id = user?.id;
      //     token.wsToken =
      //   }
      //   return token;
      // }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        wsToken: dbUser.wsToken,
      }
    },
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
        session.wsToken = token.wsToken
      }

      return session
    },
  },
}

export async function verifyCurrentUserHasAccessToPost(postId: string) {
  const session = await getServerSession(authOptions)
  const count = await db.post.count({
    where: {
      id: postId,
      authorId: session?.user.id,
    },
  })

  return count > 0
}
