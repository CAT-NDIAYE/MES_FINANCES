import { z } from 'zod'

export const transactionSchema = z.object({
  type: z.enum(['income', 'expense'], {
    required_error: 'Le type est obligatoire.',
    invalid_type_error: 'Le type est invalide.',
  }),
  amount: z.coerce
    .number({
      required_error: 'Le montant est obligatoire.',
      invalid_type_error: 'Le montant est invalide.',
    })
    .positive('Le montant doit être supérieur à 0.'),
  category_id: z
    .string({ required_error: 'La catégorie est obligatoire.' })
    .min(1, 'La catégorie est obligatoire.'),
  description: z
    .string()
    .trim()
    .max(250, 'La description ne peut dépasser 250 caractères.')
    .optional()
    .or(z.literal('')),
  transaction_date: z.string().min(1, 'La date est obligatoire.'),
})

export type TransactionFormValues = z.infer<typeof transactionSchema>
