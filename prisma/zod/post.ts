import * as z from "zod"
import * as imports from "../null"
import { CompleteUser, RelatedUserSchema } from "./index"

export const PostSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  published: z.boolean(),
  title: z.string(),
  content: z.string().nullish(),
  authorId: z.string(),
})

export interface CompletePost extends z.infer<typeof PostSchema> {
  author?: CompleteUser | null
}

/**
 * RelatedPostSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedPostSchema: z.ZodSchema<CompletePost> = z.lazy(() => PostSchema.extend({
  author: RelatedUserSchema.nullish(),
}))
