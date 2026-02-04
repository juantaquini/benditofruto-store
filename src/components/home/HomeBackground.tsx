"use client";

import dynamic from "next/dynamic";
import Image from "next/image";

const CelestialSketch = dynamic(
  () => import("@/components/home/CelestialSketch"),
  { ssr: false }
);

export default function HomeBackground() {
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
      <div className="absolute inset-0 z-10">
        <CelestialSketch />
      </div>
    </div>
  );
}
