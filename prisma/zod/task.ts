import * as z from "zod"
import * as imports from "../null"
import { Status, Priority } from "@prisma/client"
import { CompleteUser, RelatedUserSchema } from "./index"

export const TaskSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  description: z.string(),
  status: z.nativeEnum(Status),
  priority: z.nativeEnum(Priority),
  createdAt: z.date(),
  updatedAt: z.date(),
  completedAt: z.date().nullish(),
  startAt: z.date(),
  endAt: z.date(),
  userId: z.string(),
})

export interface CompleteTask extends z.infer<typeof TaskSchema> {
  user: CompleteUser
}

/**
 * RelatedTaskSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedTaskSchema: z.ZodSchema<CompleteTask> = z.lazy(() => TaskSchema.extend({
  user: RelatedUserSchema,
}))
