import ProdutosTable from "@/components/produtos/ProdutosTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export default function ProdutosPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Lista de Produtos</h1>
        <Link href="/produtos/add" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Produto
          </Button>
        </Link>
      </div>

      <ProdutosTable />
    </div>
  );
}
