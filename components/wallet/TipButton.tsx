"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Zap, Loader2, Check } from "lucide-react";
import confetti from "canvas-confetti";

interface TipButtonProps {
  creatorAddress: string;
  creatorUsername: string;
  amountUSD: number;
  onTipSent?: () => void;
  disabled?: boolean;
}

export function TipButton({
  creatorAddress,
  creatorUsername,
  amountUSD,
  onTipSent,
  disabled,
}: TipButtonProps) {
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleTip = async () => {
    setIsSending(true);

    try {
      // Call API to send tip
      const response = await fetch("/api/tip/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientAddress: creatorAddress,
          amountUSD,
          creatorUsername,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSent(true);

        // Trigger confetti animation
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#F7931A", "#5B21B6", "#3B82F6"],
        });

        onTipSent?.();

        setTimeout(() => setSent(false), 3000);
      }
    } catch (error) {
      console.error("Error sending tip:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Button
      onClick={handleTip}
      disabled={disabled || isSending || sent}
      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xl h-14 bitcoin-glow-hover relative overflow-hidden group"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 sunset-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <span className="relative z-10 flex items-center justify-center gap-2">
        {isSending ? (
          <>
            <Loader2 className="h-6 w-6 animate-spin" />
            Sending...
          </>
        ) : sent ? (
          <>
            <Check className="h-6 w-6" />
            Tip Sent!
          </>
        ) : (
          <>
            <Zap className="h-6 w-6 fill-current" />
            Tip ${amountUSD}
          </>
        )}
      </span>
    </Button>
  );
}
