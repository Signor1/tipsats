"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Wallet, Gift, TrendingUp, Bitcoin, Sparkles, ArrowRight } from "lucide-react";
import { WalletModal } from "@/components/wallet/WalletModal";
import { motion } from "framer-motion";

export default function LandingPage() {
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Logo/Branding */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <Bitcoin className="h-12 w-12 text-primary" />
            <h1 className="text-5xl md:text-7xl font-bold sunset-gradient-text">
              TipSats
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
            Tips at the Speed of Lightning.
          </p>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12">
            Powered by Bitcoin.
          </p>

          {/* Main Value Prop */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Tip content creators with Bitcoin in one click. No wallet extensions, no seed phrases,
            no crypto knowledge required. Just instant sBTC tips.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              onClick={() => setWalletModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg h-14 px-8 bitcoin-glow-hover group"
            >
              <Wallet className="mr-2 h-5 w-5" />
              Create Your Tip Link
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              className="neumorphic-card font-semibold text-lg h-14 px-8"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              See Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="neumorphic-card rounded-xl p-4">
              <div className="text-3xl font-bold sunset-gradient-text">
                &lt;10s
              </div>
              <div className="text-sm text-muted-foreground">Wallet Creation</div>
            </div>
            <div className="neumorphic-card rounded-xl p-4">
              <div className="text-3xl font-bold sunset-gradient-text">
                1-Click
              </div>
              <div className="text-sm text-muted-foreground">Tipping</div>
            </div>
            <div className="neumorphic-card rounded-xl p-4">
              <div className="text-3xl font-bold sunset-gradient-text">
                0%
              </div>
              <div className="text-sm text-muted-foreground">Platform Fee</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">
          How TipSats Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="neumorphic-card h-full">
              <CardContent className="p-8">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 bitcoin-glow">
                  <Wallet className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">1. Create Wallet</h3>
                <p className="text-muted-foreground">
                  Sign up with your email. We create an embedded Bitcoin wallet for you in seconds—no
                  extensions, no seed phrases.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="neumorphic-card h-full">
              <CardContent className="p-8">
                <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center mb-6 purple-glow">
                  <Gift className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">2. Share Link</h3>
                <p className="text-muted-foreground">
                  Get your unique tip link (tipsats.app/tip/yourname) and share it on Twitter, YouTube,
                  GitHub—anywhere!
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Card className="neumorphic-card h-full">
              <CardContent className="p-8">
                <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                  <TrendingUp className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold mb-4">3. Get Tips</h3>
                <p className="text-muted-foreground">
                  Receive instant sBTC tips from supporters. Withdraw to your external wallet anytime.
                  That's it!
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">
          Why TipSats?
        </h2>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            {
              title: "Zero Friction",
              description: "No browser extensions. No seed phrases. Just email and you're set.",
              icon: Zap,
            },
            {
              title: "Bitcoin Native",
              description: "Real Bitcoin tips via sBTC on Stacks blockchain.",
              icon: Bitcoin,
            },
            {
              title: "Instant Tips",
              description: "One-click tipping. Transactions confirm in seconds.",
              icon: Sparkles,
            },
            {
              title: "Your Keys, Your Crypto",
              description: "Non-custodial wallets powered by Turnkey. You're always in control.",
              icon: Wallet,
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="neumorphic-card">
                <CardContent className="p-6 flex gap-4">
                  <feature.icon className="h-8 w-8 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center neumorphic-card rounded-2xl p-12 bitcoin-glow">
          <h2 className="text-4xl font-bold mb-6">
            Start Earning Bitcoin Tips Today
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join the future of creator monetization. Set up your tip link in under a minute.
          </p>
          <Button
            onClick={() => setWalletModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xl h-16 px-12"
          >
            <Wallet className="mr-2 h-6 w-6" />
            Get Started for Free
          </Button>
        </div>
      </section>

      {/* Wallet Creation Modal */}
      <WalletModal
        open={walletModalOpen}
        onOpenChange={setWalletModalOpen}
        onWalletCreated={(wallet) => {
          console.log("Wallet created:", wallet);
          // Redirect to dashboard or onboarding
          window.location.href = "/dashboard";
        }}
      />
    </div>
  );
}
