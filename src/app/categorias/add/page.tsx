import SimpleForm from "@/components/common/SimpleForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Defina a interface para Categoria
interface Categoria {
  id?: number;
  nome: string;
}

export default function AddCategoriaPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/categorias" passHref>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Voltar para categorias</span>
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Adicionar Nova Categoria</h1>
      </div>
      <SimpleForm<Categoria>
        title="Categoria"
        apiEndpoint="/categorias"
        redirectPath="/categorias"
      />
    </div>
  );
}
