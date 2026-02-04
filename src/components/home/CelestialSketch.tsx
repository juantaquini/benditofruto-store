"use client";

import { useRef } from "react";
import Sketch from "react-p5";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseAlpha: number;
  phase: number;
  speed: number;
};

export default function CelestialSketch() {
  const particlesRef = useRef<Particle[]>([]);
  const lightPhaseRef = useRef(0);

  const setup = (p5: any, canvasParentRef: Element) => {
    const el = canvasParentRef as HTMLElement;
    const w = el?.clientWidth || (typeof window !== "undefined" ? window.innerWidth : 800);
    const h = el?.clientHeight || (typeof window !== "undefined" ? window.innerHeight : 600);
    p5.createCanvas(w, h).parent(canvasParentRef);
    p5.frameRate(28);

    // Crear partículas flotantes
    const count = 55;
    particlesRef.current = Array.from({ length: count }, () => ({
      x: p5.random(0, w),
      y: p5.random(0, h),
      vx: p5.random(-0.15, 0.15),
      vy: p5.random(-0.4, -0.05),
      size: p5.random(2, 5),
      baseAlpha: p5.random(0.3, 0.85),
      phase: p5.random(0, p5.TWO_PI),
      speed: p5.random(0.02, 0.06),
    }));
  };

  const draw = (p5: any) => {
    const w = p5.width;
    const h = p5.height;

    // Limpiar con transparencia para que se vea la imagen de fondo
    p5.clear(0, 0, 0, 0);

    const t = p5.frameCount * 0.02;
    lightPhaseRef.current = t;

    // Luz celestial desde arriba (gradiente suave dibujado con elipses)
    p5.noStroke();
    for (let i = 0; i < 5; i++) {
      const y = 80 + i * 120;
      const alpha = 0.12 - i * 0.018 + 0.03 * p5.sin(t + i * 0.5);
      p5.fill(255, 252, 240, p5.map(alpha, 0, 1, 0, 255));
      p5.ellipse(w / 2, -50, w * 1.2, y * 2);
    }

    // Rayo central más visible
    const pulse = 0.15 + 0.08 * p5.sin(t * 0.8);
    p5.fill(255, 255, 255, pulse * 255);
    p5.ellipse(w / 2, h * 0.15, w * 0.9, h * 0.5);

    // Partículas flotantes hacia arriba (como luz que sube)
    particlesRef.current.forEach((part) => {
      part.x += part.vx + 0.2 * p5.sin(part.phase + t);
      part.y += part.vy;
      part.phase += part.speed;

      if (part.y < -10) {
        part.y = h + 10;
        part.x = p5.random(0, w);
      }
      if (part.x < -5 || part.x > w + 5) part.x = p5.constrain(part.x, 0, w);

      const twinkle = 0.4 + 0.6 * p5.sin(part.phase) * part.baseAlpha;
      p5.fill(255, 255, 255, twinkle * 255);
      p5.noStroke();
      p5.circle(part.x, part.y, part.size);
      // Halo
      p5.fill(255, 255, 255, (twinkle * 0.35) * 255);
      p5.circle(part.x, part.y, part.size * 3);
    });
  };

  const windowResized = (p5: any) => {
    const parent = p5.canvas?.parent();
    if (parent) {
      const w = parent.clientWidth || window.innerWidth;
      const h = parent.clientHeight || window.innerHeight;
      p5.resizeCanvas(w, h);
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <Sketch
        setup={setup}
        draw={draw}
        windowResized={windowResized}
        className="!w-full !h-full"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      />
    </div>
  );
}
