"use client";

import React, { useEffect, useState } from "react";
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
import Link from "next/link";
import { Pencil, PlusCircleIcon, Trash2 } from "lucide-react";

interface SimpleEntity {
  id: number;
  nome: string;
  [key: string]: string | number | boolean | undefined;
}

interface ColumnDef<T> {
  key: keyof T;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface SimpleTableProps<T extends SimpleEntity> {
  title: string;
  apiEndpoint: string;
  basePath: string;
  columns: ColumnDef<T>[];
  onEdit?: (id: number) => void;
}

export default function SimpleTable<T extends SimpleEntity>({
  title,
  apiEndpoint,
  basePath,
  columns,
}: SimpleTableProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<T | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const singularTitle = title.endsWith("s") ? title.slice(0, -1) : title;

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}${apiEndpoint}`);
      if (!response.ok) {
        throw new Error(`Erro HTTP! status: ${response.status}`);
      }
      const result: T[] = await response.json();
      setData(result);
    } catch (err) {
      console.error(`Erro ao buscar ${title.toLowerCase()}:`, err);
      setError(`Não foi possível carregar as ${title.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [apiEndpoint, API_BASE_URL]);

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}${apiEndpoint}/${itemToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Erro ao deletar ${itemToDelete.nome}: ${response.statusText}`
        );
      }

      toast.success(`${itemToDelete.nome} deletada(o) com sucesso.`);
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
      fetchData(); // Recarrega os dados após a exclusão
    } catch (err) {
      console.error(`Erro ao deletar ${itemToDelete.nome}:`, err);
      toast.error(`Ocorreu um erro ao deletar ${itemToDelete.nome}.`);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        Carregando {title.toLowerCase()}...
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="rounded-md border">
      <div className="flex items-center justify-between mb-4 px-4 py-2 border-b">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Link href={`${basePath}/add`} passHref>
          <Button>
            <PlusCircleIcon className="mr-2 h-4 w-4" />
            Adicionar {singularTitle}
          </Button>{" "}
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={String(col.key)}>{col.header}</TableHead>
            ))}
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                className="h-24 text-center"
              >
                Nenhum(a) {title.toLowerCase()} encontrado(a).
              </TableCell>
            </TableRow>
          ) : (
            data.map((item: T) => (
              <TableRow key={item.id}>
                {columns.map((col) => (
                  <TableCell key={String(col.key)} className="font-medium">
                    {col.render ? col.render(item) : item[col.key]}
                  </TableCell>
                ))}
                <TableCell className="text-right">
                  {/* Edição pode ser um modal ou nova rota futuramente */}
                  <Link href={`${basePath}/${item.id}`} passHref>
                    <Button variant="outline" size="sm" className="mr-2">
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                  </Link>
                  <AlertDialog
                    open={isDeleteDialogOpen && itemToDelete?.id === item.id}
                    onOpenChange={setIsDeleteDialogOpen}
                  >
                    {" "}
                    {/* Adicionado open e onOpenChange */}
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setItemToDelete(item);
                          setIsDeleteDialogOpen(true); // Abre o modal explicitamente
                        }}
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
                          permanentemente **
                          <strong>{itemToDelete?.nome}</strong>** da sua base de
                          dados.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          onClick={() => {
                            setIsDeleteDialogOpen(false);
                            setItemToDelete(null);
                          }}
                        >
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                          Continuar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
