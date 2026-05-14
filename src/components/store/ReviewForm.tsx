"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ReviewFormProps {
  productId: string;
}

export default function ReviewForm({ productId }: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Selecione uma nota de 1 a 5 estrelas");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment: comment || undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Erro ao enviar avaliação");
        return;
      }

      toast.success("Avaliação enviada com sucesso!");
      setRating(0);
      setComment("");
      router.refresh();
    } catch {
      toast.error("Erro ao enviar avaliação");
    } finally {
      setLoading(false);
    }
  }

  const display = hovered || rating;

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border bg-card p-5 space-y-4">
      <h3 className="font-semibold text-base">Deixe sua avaliação</h3>

      <div>
        <p className="mb-2 text-sm text-muted-foreground">Sua nota</p>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const val = i + 1;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setRating(val)}
                onMouseEnter={() => setHovered(val)}
                onMouseLeave={() => setHovered(0)}
                aria-label={`${val} estrela${val !== 1 ? "s" : ""}`}
                className="transition-transform hover:scale-110 active:scale-95"
              >
                <Star
                  className={`size-8 transition-colors ${
                    val <= display
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-muted text-muted-foreground/30"
                  }`}
                />
              </button>
            );
          })}
          {rating > 0 && (
            <span className="ml-2 self-center text-sm text-muted-foreground">
              {["", "Péssimo", "Ruim", "Regular", "Bom", "Excelente"][rating]}
            </span>
          )}
        </div>
      </div>

      <Textarea
        placeholder="Conte sobre sua experiência com o produto (opcional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        className="resize-none"
      />

      <Button type="submit" disabled={loading || rating === 0}>
        {loading ? "Enviando..." : "Enviar Avaliação"}
      </Button>
    </form>
  );
}
