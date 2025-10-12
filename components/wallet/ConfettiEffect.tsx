"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

interface ConfettiEffectProps {
  trigger: boolean;
}

export function ConfettiEffect({ trigger }: ConfettiEffectProps) {
  useEffect(() => {
    if (trigger) {
      // Bitcoin orange confetti burst
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#F7931A", "#5B21B6", "#3B82F6", "#FFFFFF"],
        gravity: 0.8,
        scalar: 1.2,
      });

      // Delayed second burst
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: ["#F7931A", "#5B21B6"],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: ["#F7931A", "#5B21B6"],
        });
      }, 200);
    }
  }, [trigger]);

  return null;
}
