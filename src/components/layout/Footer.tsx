"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "@/components/ui/Container";

export default function Footer() {
  const isHome = usePathname() === "/";

  return (
    <footer className="bg-transparent">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
          <p
            className={
              isHome
                ? "text-sm text-[var(--foreground)] md:!text-white"
                : "text-sm text-foreground"
            }
          >
            © {new Date().getFullYear()} Bendito Fruto
          </p>

          <nav className="flex items-center gap-6">
            <Link
              href="/collections"
              className={
                isHome
                  ? "text-sm text-[var(--foreground)] transition-colors hover:text-black md:!text-white md:hover:!text-white/80"
                  : "text-sm text-foreground transition-colors hover:text-black"
              }
            >
              Productos
            </Link>
            <Link
              href="/about"
              className={
                isHome
                  ? "text-sm text-[var(--foreground)] transition-colors hover:text-black md:!text-white md:hover:!text-white/80"
                  : "text-sm text-foreground transition-colors hover:text-black"
              }
            >
              Sobre nosotros
            </Link>
            <Link
              href="/contact"
              className={
                isHome
                  ? "text-sm text-[var(--foreground)] transition-colors hover:text-black md:!text-white md:hover:!text-white/80"
                  : "text-sm text-foreground transition-colors hover:text-black"
              }
            >
              Contacto
            </Link>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
