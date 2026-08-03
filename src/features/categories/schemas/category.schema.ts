import { z } from 'zod'

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom doit faire au moins 2 caractères.')
    .max(40, 'Le nom ne doit pas dépasser 40 caractères.'),
  type: z.enum(['income', 'expense'], {
    required_error: 'Le type de catégorie est obligatoire.',
  }),
  icon: z.string().min(1, 'L\'icône est obligatoire.'),
  color: z.string().min(4, 'La couleur est obligatoire.'),
  description: z
    .string()
    .max(150, 'La description ne doit pas dépasser 150 caractères.')
    .optional()
    .or(z.literal('')),
  sort_order: z.number().int().nonnegative().optional(),
})

export type CategoryFormValues = z.infer<typeof categorySchema>
