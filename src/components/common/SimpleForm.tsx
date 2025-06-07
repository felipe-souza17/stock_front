"use client";

import React from "react";
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
import Error from "next/error";

interface SimpleEntity {
  id?: number;
  nome: string;
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
});

type SimpleFormValues = z.infer<typeof formSchema>;

interface SimpleFormProps<T extends SimpleEntity> {
  title: string;
  apiEndpoint: string;
  initialData?: T;
  redirectPath: string;
}

export default function SimpleForm<T extends SimpleEntity>({
  title,
  apiEndpoint,
  initialData,
  redirectPath,
}: SimpleFormProps<T>) {
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const form = useForm<SimpleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: initialData?.nome || "",
    },
  });

  const onSubmit = async (values: SimpleFormValues) => {
    const isEditing = initialData?.id !== undefined;
    const url = isEditing
      ? `${API_BASE_URL}${apiEndpoint}/${initialData?.id}`
      : `${API_BASE_URL}${apiEndpoint}`;
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Erro desconhecido." }));
        throw new Error(
          errorData.message || `Erro ao salvar ${title.toLowerCase()}.`
        );
      }

      toast.success(
        `${title} ${isEditing ? "atualizada" : "criada"} com sucesso.`
      );

      router.push(redirectPath);
      router.refresh();
    } catch (err) {
      console.error(`Erro ao salvar ${title.toLowerCase()}:`, err);
      toast.error(`Ocorreu um erro ao salvar ${title.toLowerCase()}.`);
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
              <FormLabel>Nome da {title}</FormLabel>
              <FormControl>
                <Input
                  placeholder={`Nome da ${title.toLowerCase()}`}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {initialData ? `Atualizar ${title}` : `Adicionar ${title}`}
        </Button>
      </form>
    </Form>
  );
}
