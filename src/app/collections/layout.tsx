import Container from "@/components/ui/Container";
export default function CollectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container className="py-24">
      <section>{children}</section>
    </Container>
  );
}
