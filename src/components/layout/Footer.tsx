import Link from "next/link";
import Container from "@/components/ui/Container";

export default function Footer() {
  return (
    <footer className="bg-transparent">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
          <p className="text-foreground text-sm">
            © {new Date().getFullYear()} Bendito Fruto
          </p>

          <nav className="flex items-center gap-6">
            <Link href="/collections" className="text-sm text-foreground transition-colors hover:text-black">
              Colección
            </Link>
            <Link href="/about" className="text-sm text-foreground transition-colors hover:text-black">
              Sobre nosotros
            </Link>
            <Link href="/contact" className="text-sm text-foreground transition-colors hover:text-black">
              Contacto
            </Link>
          </nav>
        </div>
      </Container>
    </footer>
  );
}