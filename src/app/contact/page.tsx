import Container from "@/components/ui/Container";

export default function ContactPage() {
  return (
    <Container className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col gap-6 max-w-3xl text-center text-foreground">
   
        <div className="flex flex-col sm:flex-col gap-4 justify-center items-center">
          <a
            href="mailto:milipereyralucena@gmail.com"
            className="text-foreground hover:no-underline transition"
          >
            milipereyralucena@gmail.com
          </a>
          <a
            href="https://instagram.com/benditofruto.deco"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:no-underline transition"
          >
            @benditofruto.deco
          </a>
        </div>
      </div>
    </Container>
  );
}
