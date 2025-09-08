import { z } from 'zod'

export const createPlanSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive()
})

export type TypeCreatePlanSchema = z.infer<typeof createPlanSchema>
