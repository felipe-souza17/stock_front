import ProdutoForm from "@/components/produtos/ProdutoForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AddProdutoPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/produtos" passHref>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar para produtos</span>
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Adicionar Novo Produto</h1>
      </div>

      <ProdutoForm />
    </div>
  );
}
