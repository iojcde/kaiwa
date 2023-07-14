import { User } from "next-auth"
import { JWT } from "next-auth/jwt"

type UserId = string
type wsToken = string

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId
    wsToken: wsToken
  }
}

declare module "next-auth" {
  interface Session {
    user: User & {
      id: UserId
    }

    wsToken: wsToken
  }
}
