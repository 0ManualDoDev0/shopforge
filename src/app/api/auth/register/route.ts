import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { resend, FROM_EMAIL } from "@/lib/resend";
import { registerSchema } from "@/lib/validations/user.schema";
import WelcomeEmail from "@emails/WelcomeEmail";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "E-mail já cadastrado" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: { name, email, password: hashed },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    // Fire-and-forget — email failure must never reject the registration response
    resend.emails
      .send({
        from: FROM_EMAIL,
        to: user.email!,
        subject: "Bem-vindo ao ShopForge!",
        react: WelcomeEmail({ customerName: user.name ?? "Cliente" }),
      })
      .catch(() => undefined);

    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
