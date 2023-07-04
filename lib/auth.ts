import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "./db";
import GithubProvider from "next-auth/providers/github";
import { NextAuthOptions, getServerSession } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, trigger, user }) {
      let dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (dbUser.wsToken == null) {
        db.user.update({
          where: { id: dbUser.id },
          data: {
            wsToken: require("crypto").randomBytes(256).toString("base64"),
          },
        });
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
      };
    },
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.wsToken = token.wsToken;
      }

      return session;
    },
  },
};

export async function verifyCurrentUserHasAccessToPost(postId: string) {
  const session = await getServerSession(authOptions);
  const count = await db.post.count({
    where: {
      id: postId,
      authorId: session?.user.id,
    },
  });

  return count > 0;
}
