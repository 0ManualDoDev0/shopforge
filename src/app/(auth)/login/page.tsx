import type { Metadata } from "next";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg border bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold tracking-tight">Entrar</h1>
        {/* TODO: LoginForm component */}
        <p className="text-sm text-gray-500">Formulário de login aqui</p>
      </div>
    </main>
  );
}
