import Link from "next/link";
import Container from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="flex h-[100vh] flex-col items-center justify-center text-center">
      <h2 className="text-5xl font-medium text-foreground">404</h2>
      <p className="mt-4 text-2xl font-medium text-foreground">
        Page not found
      </p>
      <p className="mt-2 text-neutral-600 mb-8">
        We couldn't find the page you're looking for.
      </p>
      <Link
        href="/"
        className="bg-foreground px-6 py-2 text-white hover:bg-neutral-800 transition-colors"
      >
        Go back to home
      </Link>
    </Container>
  );
}