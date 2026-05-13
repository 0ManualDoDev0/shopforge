import type { Metadata } from "next";

export const metadata: Metadata = { title: "Configurações — Admin" };

export default function SettingsPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Configurações</h1>
      {/* TODO: StoreSettings, NotificationSettings */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="font-semibold">Loja</h2>
        <p className="mt-1 text-sm text-gray-500">Configurações gerais da loja</p>
      </div>
    </div>
  );
}
