import Image from "next/image";
import Container from "@/components/ui/Container";

export default function Home() {
  return (
    <div className="fixed inset-0 w-full h-full -z-10">
      <Image
        src="/images/background-image.png"
        alt="Background"
        fill
        className="object-cover object-top brightness-[1.08]"
        priority
        sizes="100vw"
      />
      <div
        className="absolute inset-0 bg-white/30 pointer-events-none"
        aria-hidden
      />
    </div>
  );
}
