import SimpleTable from "@/components/common/SimpleTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

// Defina a interface para Fornecedor
interface Fornecedor {
  id: number;
  nome: string;
}

export default function FornecedoresPage() {
  const columns = [
    { key: "id", header: "ID" },
    { key: "nome", header: "Nome do Fornecedor" },
  ];

  return (
    <div className="container mx-auto py-8">
      <SimpleTable
        title="Fornecedores"
        apiEndpoint="/fornecedores"
        basePath="/fornecedores"
        columns={columns}
      />
    </div>
  );
}
