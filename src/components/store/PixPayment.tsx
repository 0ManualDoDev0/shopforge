"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Clock, QrCode, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface PixPaymentProps {
  qrCode: string;
  qrCodeBase64: string;
  paymentId: number;
}

const PIX_TIMEOUT_SECONDS = 30 * 60;

export default function PixPayment({ qrCode, qrCodeBase64, paymentId }: PixPaymentProps) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(PIX_TIMEOUT_SECONDS);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");
  const expired = timeLeft <= 0;

  async function handleCopy() {
    await navigator.clipboard.writeText(qrCode);
    setCopied(true);
    toast.success("Código Pix copiado!");
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      {/* Header */}
      <div className="rounded-xl border bg-muted/20 p-6 text-center">
        <div className="mb-3 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
          <QrCode className="size-4" />
          <span>Pedido #{paymentId}</span>
        </div>
        <p className="text-base font-semibold">
          Abra o app do seu banco e escaneie o QR code ou cole o código Pix
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          O pagamento é confirmado automaticamente em instantes.
        </p>
      </div>

      {/* QR Code image */}
      <div className="flex justify-center">
        {expired ? (
          <div className="flex h-56 w-56 flex-col items-center justify-center gap-3 rounded-xl border bg-muted/30 text-center">
            <AlertCircle className="size-10 text-muted-foreground" />
            <p className="text-sm font-medium text-muted-foreground">QR code expirado</p>
            <p className="text-xs text-muted-foreground">Volte ao carrinho para gerar um novo.</p>
          </div>
        ) : (
          /* Next.js Image does not support base64 data URIs — using <img> intentionally */
          <img
            src={`data:image/png;base64,${qrCodeBase64}`}
            alt="QR Code Pix"
            width={224}
            height={224}
            className="rounded-xl border p-2"
          />
        )}
      </div>

      {/* Timer */}
      <div
        className={`flex items-center justify-center gap-2 text-sm font-medium ${
          expired
            ? "text-destructive"
            : timeLeft <= 300
              ? "text-amber-600 dark:text-amber-400"
              : "text-muted-foreground"
        }`}
      >
        <Clock className="size-4" />
        {expired ? (
          <span>Código expirado</span>
        ) : (
          <span>
            Expira em <span className="font-mono">{minutes}:{seconds}</span>
          </span>
        )}
      </div>

      <Separator />

      {/* Copy code */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Código Pix (copia e cola)
        </p>
        <div className="flex gap-2">
          <div className="flex-1 truncate rounded-lg border bg-muted/30 px-3 py-2 font-mono text-xs">
            {qrCode}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            disabled={expired}
            className="shrink-0"
          >
            {copied ? (
              <>
                <Check className="mr-1.5 size-3.5 text-green-500" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="mr-1.5 size-3.5" />
                Copiar código
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Steps */}
      <ol className="space-y-2 rounded-xl border bg-muted/10 p-4 text-sm text-muted-foreground">
        {[
          "Abra o aplicativo do seu banco ou instituição financeira.",
          'Acesse a área de pagamentos e selecione "Pix".',
          'Escolha "Pix Copia e Cola" ou leia o QR code.',
          "Confirme o pagamento — ele cai na hora!",
        ].map((step, i) => (
          <li key={i} className="flex gap-2.5">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[11px] font-bold text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}
