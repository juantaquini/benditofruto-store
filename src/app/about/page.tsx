import Container from "@/components/ui/Container";

export default function AboutPage() {
  return (
    <Container className="flex items-center justify-center  min-h-screen">
      <div className="flex flex-col gap-6 max-w-3xl text-center text-foreground">
        <p>
          Bendito Fruto is a quiet celebration of color, landscape, and the
          subtle beauty found along everyday journeys. Born from a devotion
          to watercolor and digital exploration, each work emerges as a
          singular reflection of the world as it unfolds before us.
        </p>

        <p>
          The collection brings together original artworks that weave
          traditional techniques with contemporary sensibilities. From the
          rugged texture of distant mountain ranges to the gentle, unbroken
          flow of a river, each piece seeks to hold the essence of a
          fleeting moment and invite it into your space.
        </p>

        <p>
          We believe art should feel personal and alive. Every original and
          print is created with care and intention, offering not simply an
          object, but a story — a trace of place, time, and emotion.
        </p>
      </div>
    </Container>
  );
}
