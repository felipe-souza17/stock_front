import SimpleTable from "@/components/common/SimpleTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

// Defina a interface para Categoria
interface Categoria {
  id: number;
  nome: string;
}

export default function CategoriasPage() {
  const columns = [
    { key: "id", header: "ID" },
    { key: "nome", header: "Nome da Categoria" },
  ];

  return (
    <div className="container mx-auto py-8">
      <SimpleTable
        title="Categorias"
        apiEndpoint="/categorias"
        basePath="/categorias"
        columns={columns}
      />
    </div>
  );
}
