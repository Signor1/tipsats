"use client";

import Link from "next/link";
import { Bitcoin, Github, Twitter } from "lucide-react";

export function TipSatsFooter() {
  return (
    <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Bitcoin className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold sunset-gradient-text">
                TipSats
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm">
              Tips at the Speed of Lightning. Powered by Bitcoin. Making creator monetization frictionless with embedded wallets and sBTC.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/tip/alice" className="text-muted-foreground hover:text-foreground transition-colors">
                  Demo Tip Page
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://docs.stacks.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Stacks Docs
                </a>
              </li>
              <li>
                <a
                  href="https://docs.turnkey.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Turnkey Docs
                </a>
              </li>
              <li>
                <a
                  href="https://explorer.stacks.co/?chain=testnet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Stacks Explorer
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 TipSats. Built for Stacks Builders Challenge.
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/yourusername/tipsats"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com/tipsats"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
