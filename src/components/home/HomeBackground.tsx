"use client";

import Image from "next/image";

export default function HomeBackground() {
  return (
    <div
      className={[
        "fixed inset-0 -z-10 bg-white",
        /* Móvil: no cubrir header fijo (py-4 + h-16 + py-4) ni la banda del footer; safe areas para notch/home indicator */
        "max-md:top-[max(6rem,calc(env(safe-area-inset-top,0px)+5rem))]",
        "max-md:bottom-[calc(9rem+env(safe-area-inset-bottom,0px))]",
        "md:top-0 md:bottom-0",
      ].join(" ")}
    >
      <Image
        src="/images/Bendito_Fruto_045mobile.JPG"
        alt="Background"
        fill
        priority
        sizes="100vw"
        className="object-contain object-center md:hidden"
      />
      <Image
        src="/images/Bendito_Fruto_044.JPG"
        alt="Background"
        fill
        priority
        sizes="100vw"
        className="hidden object-cover md:block"
      />
    </div>
  );
}
