"use client";

import Image from "next/image";

export default function HomeBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-white">
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
