import SimpleForm from "@/components/common/SimpleForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

interface Params {
  id: string;
}

interface Props {
  params: Promise<Params>;
}

interface Fornecedor {
  id: number;
  nome: string;
}

async function getFornecedorById(id: string): Promise<Fornecedor | null> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const response = await fetch(`${API_BASE_URL}/fornecedores/${id}`, {
      cache: "no-store",
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Failed to fetch fornecedor ${id}`);
    const data: Fornecedor = await response.json();
    return data;
  } catch (error) {
    console.error("Erro na requisição getFornecedorById:", error);
    return null;
  }
}

export default async function EditFornecedorPage({ params }: Props) {
  const { id } = await params;
  const fornecedor = await getFornecedorById(id);

  if (!fornecedor) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/fornecedores" passHref>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar para fornecedores</span>
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">
          Editar Fornecedor #{fornecedor.id}
        </h1>
      </div>
      <SimpleForm<Fornecedor>
        title="Fornecedor"
        apiEndpoint="/fornecedores"
        initialData={fornecedor}
        redirectPath="/fornecedores"
      />
    </div>
  );
}
