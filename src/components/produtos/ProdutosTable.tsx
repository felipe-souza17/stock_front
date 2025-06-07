"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

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

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

interface ProdutosTableProps {
  initialPage?: number;
  initialSize?: number;
}

export default function ProdutosTable({
  initialPage = 0,
  initialSize = 10,
}: ProdutosTableProps) {
  const router = useRouter();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [pageSize] = useState<number>(initialSize);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [productToDelete, setProductToDelete] = useState<Produto | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchProdutos = async (page: number, size: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/produtos?page=${page}&size=${size}`
      );
      if (!response.ok) {
        throw new Error(`Erro HTTP! status: ${response.status}`);
      }
      const data: PageResponse<Produto> = await response.json();
      setProdutos(data.content);
      setTotalElements(data.totalElements);
      setTotalPages(data.totalPages);
      setCurrentPage(data.number);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setError(
        "Não foi possível carregar os produtos. Tente novamente mais tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/produtos/${productToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao deletar produto: ${response.statusText}`);
      }

      toast.success(`Produto "${productToDelete.nome}" deletado com sucesso.`);
      setProductToDelete(null);
      fetchProdutos(currentPage, pageSize);
      router.refresh();
    } catch (err) {
      console.error("Erro ao deletar produto:", err);
      toast.error("Ocorreu um erro ao deletar o produto.");
    }
  };

  useEffect(() => {
    fetchProdutos(currentPage, pageSize);
  }, [currentPage, pageSize, API_BASE_URL]);

  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const paginationItems = useMemo(() => {
    const items = [];
    const maxPagesToShow = 5;

    items.push(
      <PaginationItem key="previous">
        <PaginationPrevious
          onClick={() => handlePageChange(currentPage - 1)}
          aria-disabled={currentPage === 0}
        />
      </PaginationItem>
    );

    let startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }

    if (startPage > 0) {
      items.push(
        <PaginationItem key="1">
          <PaginationLink
            onClick={() => handlePageChange(0)}
            isActive={0 === currentPage}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 1) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={i === currentPage}
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key={totalPages - 1}>
          <PaginationLink
            onClick={() => handlePageChange(totalPages - 1)}
            isActive={totalPages - 1 === currentPage}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    items.push(
      <PaginationItem key="next">
        <PaginationNext
          onClick={() => handlePageChange(currentPage + 1)}
          aria-disabled={currentPage === totalPages - 1}
        />
      </PaginationItem>
    );

    return items;
  }, [currentPage, totalPages]);

  if (loading) {
    return <div className="text-center py-8">Carregando produtos...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (produtos.length === 0 && !loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum produto encontrado.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Estoque</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Fornecedor</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {produtos.map((produto) => (
            <TableRow key={produto.id}>
              <TableCell className="font-medium">{produto.nome}</TableCell>
              <TableCell>{produto.descricao}</TableCell>
              <TableCell>${produto.preco.toFixed(2)}</TableCell>
              <TableCell>{produto.quantidadeEstoque}</TableCell>
              <TableCell>
                {produto.categoria ? produto.categoria.nome : "N/A"}
              </TableCell>
              <TableCell>
                {produto.fornecedor ? produto.fornecedor.nome : "N/A"}
              </TableCell>
              <TableCell className="text-right">
                <Link href={`/produtos/${produto.id}`} passHref>
                  <Button variant="outline" size="sm" className="mr-2">
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setProductToDelete(produto)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Isso irá deletar
                        permanentemente o produto **{productToDelete?.nome}** da
                        sua base de dados.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteProduct}>
                        Continuar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between px-4 py-3 border-t">
        <div className="text-sm text-muted-foreground">
          Mostrando {produtos.length} de {totalElements} produtos.
        </div>
        <Pagination>
          <PaginationContent>{paginationItems}</PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
