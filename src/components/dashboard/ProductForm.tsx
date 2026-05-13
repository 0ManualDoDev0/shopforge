"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Image from "next/image";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UploadButton } from "@/lib/uploadthing";
import { slugify } from "@/lib/utils";
import type { Category } from "@prisma/client";

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(255),
  description: z.string().min(1, "Descrição é obrigatória"),
  price: z.number().positive("Preço deve ser positivo"),
  comparePrice: z.number().positive().optional(),
  stock: z.number().int().min(0),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  isFeatured: z.boolean(),
});

type FormValues = {
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  stock: number;
  categoryId: string;
  isFeatured: boolean;
};

export default function ProductForm({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { isFeatured: false, stock: 0 },
  });

  const nameValue = watch("name") ?? "";

  function removeImage(url: string) {
    setImages((prev) => prev.filter((i) => i !== url));
  }

  async function onSubmit(data: FormValues) {
    if (images.length === 0) {
      toast.error("Adicione pelo menos uma imagem");
      return;
    }
    setIsSubmitting(true);
    try {
      const body = {
        ...data,
        images,
        isArchived: false,
        comparePrice:
          data.comparePrice && !Number.isNaN(data.comparePrice) && data.comparePrice > 0
            ? data.comparePrice
            : undefined,
      };
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? "Erro ao criar produto");
      }
      toast.success("Produto criado com sucesso!");
      router.push("/dashboard/products");
      router.refresh();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Erro ao criar produto");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
      {/* Nome */}
      <div className="space-y-1.5">
        <Label htmlFor="name">Nome do Produto *</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Ex.: Camiseta Premium"
        />
        {nameValue && (
          <p className="text-xs text-muted-foreground">
            Slug:{" "}
            <span className="font-mono">{slugify(nameValue)}</span>
          </p>
        )}
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Descrição */}
      <div className="space-y-1.5">
        <Label htmlFor="description">Descrição *</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Descreva o produto..."
          rows={4}
        />
        {errors.description && (
          <p className="text-xs text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Preço + Preço Comparativo */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="price">Preço (R$) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            {...register("price", { valueAsNumber: true })}
            placeholder="0.00"
          />
          {errors.price && (
            <p className="text-xs text-destructive">{errors.price.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="comparePrice">Preço Comparativo (R$)</Label>
          <Input
            id="comparePrice"
            type="number"
            step="0.01"
            min="0"
            {...register("comparePrice", { valueAsNumber: true })}
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Estoque + Categoria */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="stock">Estoque *</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            {...register("stock", { valueAsNumber: true })}
            placeholder="0"
          />
          {errors.stock && (
            <p className="text-xs text-destructive">{errors.stock.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label>Categoria *</Label>
          <Select onValueChange={(v: string | null) => { if (v) setValue("categoryId", v); }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecionar..." />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && (
            <p className="text-xs text-destructive">
              {errors.categoryId.message}
            </p>
          )}
        </div>
      </div>

      {/* Destaque */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="isFeatured"
          onCheckedChange={(checked) => setValue("isFeatured", !!checked)}
        />
        <Label htmlFor="isFeatured" className="cursor-pointer font-normal">
          Produto em destaque
        </Label>
      </div>

      {/* Imagens */}
      <div className="space-y-3">
        <Label>Imagens (máx. 5) *</Label>

        {images.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {images.map((url) => (
              <div
                key={url}
                className="relative h-20 w-20 overflow-hidden rounded-lg border bg-muted"
              >
                <Image
                  src={url}
                  alt="Preview"
                  fill
                  className="object-cover"
                  sizes="80px"
                />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute right-1 top-1 rounded-full bg-background/80 p-0.5 hover:bg-background"
                  aria-label="Remover imagem"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {images.length < 5 && (
          <UploadButton
            endpoint="productImage"
            onClientUploadComplete={(res) => {
              const urls = res
                .map((f) => (f as unknown as { ufsUrl?: string; url?: string }).ufsUrl ?? (f as unknown as { url?: string }).url ?? "")
                .filter(Boolean);
              setImages((prev) => [...prev, ...urls].slice(0, 5));
              toast.success(`${res.length} imagem(ns) enviada(s)`);
            }}
            onUploadError={(err) => {
              toast.error(`Upload falhou: ${err.message}`);
            }}
          />
        )}

        {images.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Faça upload de pelo menos 1 imagem.
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
          Criar Produto
        </Button>
        <Button
          type="button"
          variant="outline"
          render={<Link href="/dashboard/products" />}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
