import { Button } from "@/components/ui/button";
import Link from "next/link"; // Importar o componente Link

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Bem-vindo ao Controle de Estoque!
      </h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-2xl">
        Gerencie seus produtos, categorias e fornecedores de forma eficiente e
        intuitiva.
      </p>
      <div className="space-x-4">
        {/* Usar Link para navegação */}
        <Link href="/produtos" passHref>
          <Button size="lg">Ver Produtos</Button>
        </Link>
        <Link href="/categorias" passHref>
          <Button size="lg" variant="outline">
            Ver Categorias
          </Button>
        </Link>
      </div>
      {/* Futuramente, adicionaremos aqui o Dashboard com insights */}
    </div>
  );
}
