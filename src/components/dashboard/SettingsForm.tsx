"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function SettingsForm() {
  const [storeName, setStoreName] = useState("ShopForge");
  const [contactEmail, setContactEmail] = useState("");
  const [orderPrefix, setOrderPrefix] = useState("SF");
  const [isSaving, setIsSaving] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      toast.success("Configurações salvas com sucesso");
      setIsSaving(false);
    }, 500);
  }

  return (
    <form onSubmit={handleSave} className="max-w-lg space-y-8">
      {/* Informações da Loja */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-semibold">Informações da Loja</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Configure o nome e contato da sua loja.
          </p>
        </div>
        <Separator />

        <div className="space-y-1.5">
          <Label htmlFor="storeName">Nome da Loja</Label>
          <Input
            id="storeName"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="ShopForge"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="contactEmail">E-mail de Contato</Label>
          <Input
            id="contactEmail"
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="contato@shopforge.com"
          />
        </div>
      </div>

      {/* Configurações de Pedidos */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-semibold">Configurações de Pedidos</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Prefixo exibido nos números dos pedidos.
          </p>
        </div>
        <Separator />

        <div className="space-y-1.5">
          <Label htmlFor="orderPrefix">Prefixo do Pedido</Label>
          <Input
            id="orderPrefix"
            value={orderPrefix}
            onChange={(e) => setOrderPrefix(e.target.value.toUpperCase())}
            placeholder="SF"
            maxLength={6}
            className="max-w-32"
          />
          <p className="text-xs text-muted-foreground">
            Exemplo: #{orderPrefix}-00001
          </p>
        </div>
      </div>

      <Button type="submit" disabled={isSaving}>
        {isSaving ? "Salvando…" : "Salvar Configurações"}
      </Button>
    </form>
  );
}
