import { registerFormSchema, registerSchema, loginSchema } from "../user.schema";

describe("registerSchema", () => {
  const valid = {
    name: "João Silva",
    email: "joao@example.com",
    password: "senha123",
  };

  test("dados válidos passam", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  test("email inválido falha", () => {
    const result = registerSchema.safeParse({ ...valid, email: "nao-e-email" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
    }
  });

  test("email vazio falha", () => {
    const result = registerSchema.safeParse({ ...valid, email: "" });
    expect(result.success).toBe(false);
  });

  test("senha com menos de 8 caracteres falha", () => {
    const result = registerSchema.safeParse({ ...valid, password: "1234567" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password).toBeDefined();
    }
  });

  test("senha com exatamente 8 caracteres passa", () => {
    const result = registerSchema.safeParse({ ...valid, password: "12345678" });
    expect(result.success).toBe(true);
  });

  test("nome com menos de 2 caracteres falha", () => {
    const result = registerSchema.safeParse({ ...valid, name: "J" });
    expect(result.success).toBe(false);
  });
});

describe("registerFormSchema (com confirmPassword)", () => {
  const valid = {
    name: "João Silva",
    email: "joao@example.com",
    password: "senha123",
    confirmPassword: "senha123",
  };

  test("dados válidos passam", () => {
    expect(registerFormSchema.safeParse(valid).success).toBe(true);
  });

  test("confirmPassword diferente da senha falha", () => {
    const result = registerFormSchema.safeParse({
      ...valid,
      confirmPassword: "outrasenha",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten();
      expect(errors.fieldErrors.confirmPassword).toBeDefined();
    }
  });

  test("confirmPassword vazio falha", () => {
    const result = registerFormSchema.safeParse({
      ...valid,
      confirmPassword: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  const valid = { email: "joao@example.com", password: "qualquercoisa" };

  test("dados válidos passam", () => {
    expect(loginSchema.safeParse(valid).success).toBe(true);
  });

  test("email inválido falha", () => {
    const result = loginSchema.safeParse({ ...valid, email: "invalido" });
    expect(result.success).toBe(false);
  });

  test("senha vazia falha", () => {
    const result = loginSchema.safeParse({ ...valid, password: "" });
    expect(result.success).toBe(false);
  });
});
