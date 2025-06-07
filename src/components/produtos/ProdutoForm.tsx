"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Categoria {
  id: number;
  nome: string;
}

interface Fornecedor {
  id: number;
  nome: string;
}

interface Produto {
  id?: number;
  nome: string;
  descricao: string;
  preco: number;
  quantidadeEstoque: number;
  categoria?: Categoria;
  fornecedor?: Fornecedor;
}

const formSchema = z.object({
  nome: z
    .string()
    .min(2, {
      message: "O nome deve ter pelo menos 2 caracteres.",
    })
    .max(50, {
      message: "O nome não pode exceder 50 caracteres.",
    }),
  descricao: z
    .string()
    .max(200, {
      message: "A descrição não pode exceder 200 caracteres.",
    })
    .optional()
    .or(z.literal("")),
  preco: z.coerce
    .number()
    .min(0.01, {
      message: "O preço deve ser maior que zero.",
    })
    .max(9999999.99, {
      message: "Preço muito alto.",
    }),
  quantidadeEstoque: z.coerce
    .number()
    .int()
    .min(0, {
      message: "A quantidade em estoque não pode ser negativa.",
    })
    .max(99999, {
      message: "Quantidade muito alta.",
    }),
  categoriaId: z.string().optional(),
  fornecedorId: z.string().optional(),
});

type ProdutoFormValues = z.infer<typeof formSchema>;

interface ProdutoFormProps {
  initialData?: Produto;
}

export default function ProdutoForm({ initialData }: ProdutoFormProps) {
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const form = useForm<ProdutoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: initialData?.nome || "",
      descricao: initialData?.descricao || "",
      preco: initialData?.preco !== undefined ? initialData.preco : 0.01,
      quantidadeEstoque:
        initialData?.quantidadeEstoque !== undefined
          ? initialData.quantidadeEstoque
          : 0,
      categoriaId: initialData?.categoria?.id
        ? String(initialData.categoria.id)
        : "",
      fornecedorId: initialData?.fornecedor?.id
        ? String(initialData.fornecedor.id)
        : "",
    },
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoadingOptions(true);
        const [categoriasRes, fornecedoresRes] = await Promise.all([
          fetch(`${API_BASE_URL}/categorias`),
          fetch(`${API_BASE_URL}/fornecedores`),
        ]);

        if (!categoriasRes.ok || !fornecedoresRes.ok) {
          throw new Error(
            "Erro ao carregar opções de categoria ou fornecedor."
          );
        }

        const categoriasData: Categoria[] = await categoriasRes.json();
        const fornecedoresData: Fornecedor[] = await fornecedoresRes.json();

        setCategorias(categoriasData);
        setFornecedores(fornecedoresData);
      } catch (err) {
        console.error("Erro ao carregar opções:", err);
        toast.error("Não foi possível carregar categorias ou fornecedores.");
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, [API_BASE_URL]);

  const onSubmit = async (values: ProdutoFormValues) => {
    const isEditing = initialData?.id !== undefined;
    const url = isEditing
      ? `${API_BASE_URL}/produtos/${initialData?.id}`
      : `${API_BASE_URL}/produtos`;
    const method = isEditing ? "PUT" : "POST";

    const payload = {
      ...values,
      preco: Number(values.preco),
      quantidadeEstoque: Number(values.quantidadeEstoque),
      categoria: values.categoriaId ? { id: values.categoriaId } : null,
      fornecedor: values.fornecedorId ? { id: values.fornecedorId } : null,
    };

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Erro desconhecido." }));
        throw new Error(errorData.message || "Erro ao salvar o produto.");
      }

      toast.success(
        `Produto ${isEditing ? "atualizado" : "criado"} com sucesso.`
      );

      router.push("/produtos");
      router.refresh();
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      toast.error("Ocorreu um erro ao salvar o produto.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome do produto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descrição do produto (opcional)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="preco"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="99.99"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantidadeEstoque"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade em Estoque</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="categoriaId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* Esta é a ÚNICA opção com value="" e deve vir primeiro se opcional */}
                    <SelectItem value="nenhum">Nenhum</SelectItem>

                    {loadingOptions ? (
                      <div className="p-2 text-center text-sm text-muted-foreground">
                        Carregando categorias...
                      </div>
                    ) : categorias.length === 0 ? (
                      <div className="p-2 text-center text-sm text-muted-foreground">
                        Nenhuma categoria disponível
                      </div>
                    ) : (
                      categorias.map((categoria) => (
                        <SelectItem
                          key={categoria.id}
                          value={String(categoria.id)}
                        >
                          {categoria.nome}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fornecedorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fornecedor</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um fornecedor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {loadingOptions ? (
                      <SelectItem value="n_fornecedores" disabled>
                        Carregando fornecedores...
                      </SelectItem>
                    ) : fornecedores.length === 0 ? (
                      <SelectItem value="n_fornecedores" disabled>
                        Nenhuma fornecedor disponível
                      </SelectItem>
                    ) : (
                      fornecedores.map((fornecedor) => (
                        <SelectItem
                          key={fornecedor.id}
                          value={String(fornecedor.id)}
                        >
                          {fornecedor.nome}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full">
          {initialData ? "Atualizar Produto" : "Adicionar Produto"}
        </Button>
      </form>
    </Form>
  );
}
