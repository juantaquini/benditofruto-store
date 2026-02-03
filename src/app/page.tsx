import Image from "next/image";
import Container from "@/components/ui/Container";

export default function Home() {
  return (
    <div className="fixed inset-0 w-full h-full -z-10">
      <Image
        src="/images/IMG_1224.jpeg"
        alt="Aguayo azul"
        fill
        className="object-cover object-center"
        priority
        sizes="100vw"
      />
    </div>
  );
}
