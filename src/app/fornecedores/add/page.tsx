import SimpleForm from "@/components/common/SimpleForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Defina a interface para Fornecedor
interface Fornecedor {
  id?: number;
  nome: string;
}

export default function AddFornecedorPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/fornecedores" passHref>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar para fornecedores</span>
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Adicionar Novo Fornecedor</h1>
      </div>
      <SimpleForm<Fornecedor>
        title="Fornecedor"
        apiEndpoint="/fornecedores"
        redirectPath="/fornecedores"
      />
    </div>
  );
}
