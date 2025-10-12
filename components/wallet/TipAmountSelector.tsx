"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bitcoin } from "lucide-react";

interface TipAmountSelectorProps {
  onAmountSelect: (amount: number) => void;
  selectedAmount: number;
}

const PRESET_AMOUNTS = [1, 5, 10, 25];

export function TipAmountSelector({ onAmountSelect, selectedAmount }: TipAmountSelectorProps) {
  const [customAmount, setCustomAmount] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const handleCustomSubmit = () => {
    const amount = parseFloat(customAmount);
    if (!isNaN(amount) && amount > 0) {
      onAmountSelect(amount);
      setShowCustom(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {PRESET_AMOUNTS.map((amount) => (
          <Button
            key={amount}
            onClick={() => onAmountSelect(amount)}
            variant={selectedAmount === amount ? "default" : "outline"}
            className={`h-16 text-lg font-bold ${
              selectedAmount === amount
                ? "bg-primary text-primary-foreground bitcoin-glow"
                : "neumorphic-card hover:border-primary/50"
            }`}
          >
            <Bitcoin className="h-5 w-5 mr-2" />
            ${amount}
          </Button>
        ))}
      </div>

      {!showCustom ? (
        <Button
          onClick={() => setShowCustom(true)}
          variant="outline"
          className="w-full neumorphic-card"
        >
          Custom Amount
        </Button>
      ) : (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <Input
              type="number"
              placeholder="0.00"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="pl-7 bg-input border-border"
              min="0.01"
              step="0.01"
            />
          </div>
          <Button
            onClick={handleCustomSubmit}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Set
          </Button>
        </div>
      )}

      {selectedAmount > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          ≈ {(selectedAmount / 0.5).toFixed(6)} STX
        </div>
      )}
    </div>
  );
}
