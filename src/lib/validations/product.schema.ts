import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(255),
  description: z.string().min(1, "Descrição é obrigatória"),
  price: z.coerce.number().positive("Preço deve ser positivo"),
  comparePrice: z.coerce.number().positive().optional(),
  stock: z.coerce.number().int().min(0).default(0),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  images: z.array(z.string().url()).min(1, "Pelo menos uma imagem é necessária"),
  isFeatured: z.boolean().default(false),
  isArchived: z.boolean().default(false),
});

export type ProductInput = z.infer<typeof productSchema>;
