"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

const PARTICLE_COUNT = 32;
const PARTICLE_SIZE = 3;

function useParticles() {
  return useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 2 + Math.random() * 3,
      size: PARTICLE_SIZE + Math.random() * 2,
      opacity: 0.4 + Math.random() * 0.5,
    }));
  }, []);
}

export default function CelestialOverlay() {
  const particles = useParticles();

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden
    >
      {/* Luz celestial desde arriba */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 15%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.12) 35%, transparent 65%)",
        }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Segunda capa: calidez dorada */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 90% at 50% 25%, rgba(255,248,235,0.2) 0%, rgba(255,245,220,0.06) 45%, transparent 65%)",
        }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Partículas que parpadean */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            boxShadow: `0 0 ${p.size * 4}px rgba(255,255,255,0.9), 0 0 ${p.size * 8}px rgba(255,255,255,0.4)`,
          }}
          animate={{
            opacity: [p.opacity * 0.25, p.opacity, p.opacity * 0.25],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
