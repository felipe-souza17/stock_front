import SimpleTable from "@/components/common/SimpleTable";

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
