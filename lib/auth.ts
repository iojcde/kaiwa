import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions, getServerSession } from "next-auth"
import EmailProvider from "next-auth/providers/email"
import GithubProvider from "next-auth/providers/github"
import { db } from "@/lib/db"
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

      //   if (dbUser.wsToken == null) {
      //     dbUser = await db.user.update({
      //       where: { id: dbUser.id },
      //       data: {
      //         wsToken: require("crypto").randomBytes(256).toString("base64"),
      //       },
      //     })
      //   }

      //   if (trigger == "signUp") {
      //     const invites = await db.invite.findMany({
      //       where: { email: token.email },
      //     })

      //     if (invites.length > 0) {
      //       await db.access.createMany({
      //         data: invites.map((invite) => {
      //           return {
      //             level: invite.level,
      //             postId: invite.postId,
      //             userId: dbUser.id,
      //           }
      //         }),
      //       })
      //     }
      //   }

      //   // if (!dbUser) {
      //   //   if (user) {
      //   //     token.id = user?.id;
      //   //     token.wsToken =
      //   //   }
      //   //   return token;
      //   // }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      }
    },
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
      }

      return session
    },
  },
}

export const checkVaultAccess = async (vaultId: number) => {
  const session = await getServerSession()
  if (!session) throw new Error("Unauthorized")

  const vault = await db.vault.findUnique({
    where: {
      users: {
        some: {
          id: {
            equals: session.user.id,
          },
        },
      },
      id: vaultId,
    },
  })

  if (!vault) throw new Error("Vault not found")
}
