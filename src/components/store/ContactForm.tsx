"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Informe um e-mail válido"),
  assunto: z.string().min(3, "Assunto deve ter pelo menos 3 caracteres"),
  mensagem: z
    .string()
    .min(10, "Mensagem deve ter pelo menos 10 caracteres")
    .max(2000, "Mensagem não pode ultrapassar 2000 caracteres"),
});

type FormData = z.infer<typeof schema>;

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    await new Promise((r) => setTimeout(r, 800));
    console.log("Contact form submission:", data);
    toast.success("Mensagem enviada com sucesso!", {
      description: "Retornaremos em até 1 dia útil.",
    });
    reset();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border bg-muted/20 p-12 text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <Send className="size-7 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-lg font-bold">Mensagem enviada!</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Recebemos seu contato e retornaremos em até 1 dia útil.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="nome">Nome completo</Label>
          <Input
            id="nome"
            placeholder="Seu nome"
            autoComplete="name"
            {...register("nome")}
          />
          {errors.nome && (
            <p className="text-xs text-destructive">{errors.nome.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            autoComplete="email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="assunto">Assunto</Label>
        <Input
          id="assunto"
          placeholder="Sobre o que você quer falar?"
          {...register("assunto")}
        />
        {errors.assunto && (
          <p className="text-xs text-destructive">{errors.assunto.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="mensagem">Mensagem</Label>
        <Textarea
          id="mensagem"
          placeholder="Descreva sua dúvida, sugestão ou reclamação em detalhes..."
          rows={5}
          className="resize-none"
          {...register("mensagem")}
        />
        {errors.mensagem && (
          <p className="text-xs text-destructive">{errors.mensagem.message}</p>
        )}
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        <Send className="mr-2 size-4" />
        {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
      </Button>
    </form>
  );
}
