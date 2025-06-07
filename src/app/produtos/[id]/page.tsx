import ProdutoForm from "@/components/produtos/ProdutoForm";
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
interface Categoria {
  id: number;
  nome: string;
}

interface Fornecedor {
  id: number;
  nome: string;
}

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  quantidadeEstoque: number;
  categoria?: Categoria;
  fornecedor?: Fornecedor;
}

async function getProdutoById(id: string): Promise<Produto | null> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  try {
    const response = await fetch(`${API_BASE_URL}/produtos/${id}`, {
      cache: "no-store",
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      console.error(
        `Erro ao buscar produto ${id}:`,
        response.status,
        response.statusText
      );
      throw new Error(`Failed to fetch product ${id}`);
    }

    const data: Produto = await response.json();
    return data;
  } catch (error) {
    console.error("Erro na requisição getProdutoById:", error);
    return null;
  }
}

export default async function EditProdutoPage({ params }: Props) {
  const { id } = await params;

  const produto = await getProdutoById(id);

  if (!produto) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/produtos" passHref>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar para produtos</span>
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Editar Produto #{produto.id}</h1>
      </div>
      <ProdutoForm initialData={produto} />
    </div>
  );
}
