"use client";

import Link from "next/link";
import {
  Package2,
  Menu,
  LayoutDashboard,
  Truck,
  Tag,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { logout } = useAuth();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base whitespace-nowrap"
          >
            <LayoutDashboard className="h-6 w-6" />
            <span className="sr-only">Controle de Estoque</span>
            Controle de Estoque
          </Link>
          <Link
            href="/produtos"
            className="flex gap-1 items-center  text-muted-foreground transition-colors hover:text-foreground"
          >
            <Package2 className="h-4 w-4" />
            Produtos
          </Link>
          <Link
            href="/categorias"
            className="flex gap-1 items-center  text-muted-foreground transition-colors hover:text-foreground"
          >
            <Tag className="h-4 w-4" />
            Categorias
          </Link>
          <Link
            href="/fornecedores"
            className="flex gap-1 items-center text-muted-foreground transition-colors hover:text-foreground"
          >
            <Truck className="h-4 w-4" />
            Fornecedores
          </Link>
          <Button
            onClick={logout}
            className="ml-4 bg-red-600 hover:bg-red-700 text-white flex items-center gap-1"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
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
                  <LayoutDashboard className="h-6 w-6" />
                  <span>Controle de Estoque</span>
                </Link>
              </SheetTitle>{" "}
            </SheetHeader>
            <nav className="grid gap-6 ml-4 text-lg font-medium">
              <Link
                href="/produtos"
                className="flex gap-1 items-center hover:text-foreground"
              >
                <Package2 className="h-4 w-4" />
                Produtos
              </Link>
              <Link
                href="/categorias"
                className="flex gap-1 items-center hover:text-foreground"
              >
                <Tag className="h-4 w-4" />
                Categorias
              </Link>
              <Link
                href="/fornecedores"
                className="flex gap-1 items-center hover:text-foreground"
              >
                <Truck className="h-4 w-4" />
                Fornecedores
              </Link>
              <Button
                onClick={logout}
                className=" bg-red-600 hover:bg-red-700 text-white flex items-center gap-1 w-24"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
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
