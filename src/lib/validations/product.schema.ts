import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").max(255),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  price: z.number().positive("Preço deve ser positivo"),
  comparePrice: z.number().positive().optional(),
  stock: z.number().int().nonnegative(),
  categoryId: z.string().cuid("Categoria inválida"),
  isFeatured: z.boolean().default(false),
  isArchived: z.boolean().default(false),
  images: z.array(z.string().url()).min(1, "Pelo menos uma imagem é necessária"),
});

export type ProductInput = z.infer<typeof productSchema>;
