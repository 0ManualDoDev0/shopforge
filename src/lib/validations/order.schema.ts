import { z } from "zod";

export const addressSchema = z.object({
  street: z.string().min(1, "Endereço é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().length(2, "Use a sigla do estado (ex: SP)"),
  country: z.string().default("BR"),
  postalCode: z.string().regex(/^\d{5}-?\d{3}$/, "CEP inválido (ex: 01310-100)"),
});

export const checkoutSchema = z.object({
  address: addressSchema,
});

export type AddressInput = z.infer<typeof addressSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
