import * as z from "zod"
import * as imports from "../null"
import { CompleteAccount, RelatedAccountSchema, CompleteSession, RelatedSessionSchema, CompletePost, RelatedPostSchema } from "./index"

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().nullish(),
  email: z.string().nullish(),
  emailVerified: z.date().nullish(),
  image: z.string().nullish(),
})

export interface CompleteUser extends z.infer<typeof UserSchema> {
  accounts: CompleteAccount[]
  sessions: CompleteSession[]
  tasks: CompletePost[]
}

/**
 * RelatedUserSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserSchema: z.ZodSchema<CompleteUser> = z.lazy(() => UserSchema.extend({
  accounts: RelatedAccountSchema.array(),
  sessions: RelatedSessionSchema.array(),
  tasks: RelatedPostSchema.array(),
}))
