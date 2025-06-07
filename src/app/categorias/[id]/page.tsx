import SimpleForm from "@/components/common/SimpleForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { type NextPage } from "next";

interface Categoria {
  id: number;
  nome: string;
}

interface Params {
  id: string;
}

interface Props {
  params: Params;
}

async function getCategoriaById(id: string): Promise<Categoria | null> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
      cache: "no-store",
    });
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error(
        `Falha ao buscar categoria ${id}: ${response.statusText}`
      );
    }
    const data: Categoria = await response.json();
    return data;
  } catch (error) {
    console.error("Erro na requisição getCategoriaById:", error);
    return null;
  }
}

export default async function EditCategoriaPage({ params }: Props) {
  const { id } = params;

  const categoria = await getCategoriaById(id);

  if (!categoria) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/categorias" passHref>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar para categorias</span>
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Editar Categoria #{categoria.id}</h1>
      </div>
      <SimpleForm<Categoria>
        title="Categoria"
        apiEndpoint="/categorias"
        initialData={categoria}
        redirectPath="/categorias"
      />
    </div>
  );
}
