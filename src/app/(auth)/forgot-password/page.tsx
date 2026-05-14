"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Mail, Package2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Informe um e-mail válido"),
});
type FormInput = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<FormInput>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  async function onSubmit(_data: FormInput) {
    setIsPending(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsPending(false);
    setSent(true);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Package2 className="size-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Esqueceu a senha?</CardTitle>
          <CardDescription>
            Digite seu e-mail e enviaremos um link para redefinir sua senha.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {sent ? (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
                <Mail className="size-7 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Verifique seu e-mail</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Se este e-mail estiver cadastrado, você receberá um link de
                  recuperação em breve.
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Não recebeu?{" "}
                <button
                  type="button"
                  className="text-primary underline underline-offset-2 hover:no-underline"
                  onClick={() => { setSent(false); form.reset(); }}
                >
                  Tentar novamente
                </button>
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="seu@email.com"
                          autoComplete="email"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar link de recuperação"
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>

        <CardFooter className="justify-center">
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            Voltar para o login
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
