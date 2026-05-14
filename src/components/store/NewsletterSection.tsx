"use client";

import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      toast.success("Cupom enviado!", {
        description: `Enviamos 10% de desconto para ${email}`,
      });
      setEmail("");
      setLoading(false);
    }, 800);
  }

  return (
    <section className="bg-gray-900 py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-violet-500/20 px-3 py-1 text-xs font-medium text-violet-300">
              <Mail className="size-3.5" />
              Oferta exclusiva
            </div>
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              10% de desconto na primeira compra
            </h2>
            <p className="mt-2 text-sm text-white/60">
              Cadastre seu email e receba o cupom direto na sua caixa de entrada.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-md flex-col gap-2 sm:flex-row"
          >
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 border-white/20 bg-white/10 text-white placeholder:text-white/40 focus-visible:ring-violet-400"
            />
            <Button
              type="submit"
              disabled={loading}
              className="shrink-0 bg-violet-600 hover:bg-violet-700 text-white gap-2"
            >
              {loading ? "Enviando..." : "Quero meu desconto"}
              {!loading && <ArrowRight className="size-4" />}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
