import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cep = req.nextUrl.searchParams.get("cep")?.replace(/\D/g, "");

  if (!cep || cep.length !== 8) {
    return NextResponse.json({ erro: true, message: "CEP inválido" }, { status: 400 });
  }

  const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    return NextResponse.json({ erro: true, message: "Falha ao consultar ViaCEP" }, { status: 502 });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
