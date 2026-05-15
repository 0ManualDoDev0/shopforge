import { productSchema } from "../product.schema";

const VALID_CUID = "clh3yfvyx0000h2xxabcdefgh";

const validProduct = {
  name: "Camiseta Premium",
  description: "Descrição completa do produto com mais de dez caracteres.",
  price: 99.9,
  stock: 10,
  categoryId: VALID_CUID,
  isFeatured: false,
  isArchived: false,
  images: ["https://example.com/image.jpg"],
};

describe("productSchema", () => {
  test("produto válido passa na validação", () => {
    const result = productSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
  });

  test("nome com menos de 3 caracteres falha", () => {
    const result = productSchema.safeParse({ ...validProduct, name: "AB" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toBeDefined();
    }
  });

  test("preço negativo falha", () => {
    const result = productSchema.safeParse({ ...validProduct, price: -1 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.price).toBeDefined();
    }
  });

  test("preço zero falha", () => {
    const result = productSchema.safeParse({ ...validProduct, price: 0 });
    expect(result.success).toBe(false);
  });

  test("images vazia falha", () => {
    const result = productSchema.safeParse({ ...validProduct, images: [] });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.images).toBeDefined();
    }
  });

  test("image com URL inválida falha", () => {
    const result = productSchema.safeParse({
      ...validProduct,
      images: ["not-a-url"],
    });
    expect(result.success).toBe(false);
  });

  test("categoryId inválido (não é CUID) falha", () => {
    const result = productSchema.safeParse({
      ...validProduct,
      categoryId: "id-invalido",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.categoryId).toBeDefined();
    }
  });

  test("stock negativo falha", () => {
    const result = productSchema.safeParse({ ...validProduct, stock: -1 });
    expect(result.success).toBe(false);
  });

  test("stock zero é válido", () => {
    const result = productSchema.safeParse({ ...validProduct, stock: 0 });
    expect(result.success).toBe(true);
  });

  test("descrição com menos de 10 caracteres falha", () => {
    const result = productSchema.safeParse({
      ...validProduct,
      description: "Curta",
    });
    expect(result.success).toBe(false);
  });

  test("comparePrice opcional está ausente — passa", () => {
    const { comparePrice: _, ...withoutCompare } = {
      ...validProduct,
      comparePrice: undefined,
    };
    const result = productSchema.safeParse(withoutCompare);
    expect(result.success).toBe(true);
  });
});
