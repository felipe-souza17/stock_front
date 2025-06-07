import SimpleTable from "@/components/common/SimpleTable";

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
