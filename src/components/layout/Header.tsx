"use client";

import Link from "next/link";
import { Package2, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base whitespace-nowrap"
          >
            <Package2 className="h-6 w-6" />
            <span className="sr-only">Controle de Estoque</span>
            Controle de Estoque
          </Link>
          <Link
            href="/produtos"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Produtos
          </Link>
          <Link
            href="/categorias"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Categorias
          </Link>
          <Link
            href="/fornecedores"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Fornecedores
          </Link>
        </nav>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Navegação menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              {" "}
              <SheetTitle>
                <Link
                  href="/"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Package2 className="h-6 w-6" />
                  <span>Controle de Estoque</span>
                </Link>
              </SheetTitle>{" "}
            </SheetHeader>
            <nav className="grid gap-6 ml-4 text-lg font-medium">
              <Link href="/produtos" className="hover:text-foreground">
                Produtos
              </Link>
              <Link href="/categorias" className="hover:text-foreground">
                Categorias
              </Link>
              <Link href="/fornecedores" className="hover:text-foreground">
                Fornecedores
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto flex-1 sm:flex-initial"></div>
        </div>
      </div>
    </header>
  );
}
