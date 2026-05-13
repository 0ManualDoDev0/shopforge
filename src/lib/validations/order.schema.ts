import { z } from "zod";

export const orderItemSchema = z.object({
  productId: z.string().cuid("ID de produto inválido"),
  quantity: z.number().int().positive("Quantidade deve ser positiva"),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "Pelo menos um item é necessário"),
});

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

export type OrderItemInput = z.infer<typeof orderItemSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
