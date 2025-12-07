"use client";

import { usePathname } from "next/navigation";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import Link from "next/link";
import CustomUserMenu from "./CustomUserMenu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import Image from "next/image";

export function Navbar() {
  const pathname = usePathname();

  // Shared Nav Links
  const NavLinks = () => (
    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
      <Link href="/#features" className="hover:text-foreground transition-colors">
        Features
      </Link>
      <Link href="/#pricing" className="hover:text-foreground transition-colors">
        Pricing
      </Link>
      <Link href="/tools" className="hover:text-foreground transition-colors">
        Tools
      </Link>
    </nav>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/5 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 group">
          <div className="bg-[#ff1101]/10 p-2 rounded-full group-hover:bg-[#ff1101]/20 transition-colors">
            <Image src="/logo.png" alt="Logo" width={40} height={40} />
          </div>
          <span className="font-bold text-xl tracking-tight"><span className="text-[#ff1101]">Un</span>Faked</span>
        </Link>

        {/* Center Nav */}
        <NavLinks />

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" className="hidden sm:inline-flex hover:text-[#ff1101] hover:bg-[#ff1101]/10">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="rounded-full bg-[#ff1101] text-white hover:bg-[#ff1101]/90 shadow-[0_0_20px_-5px_#ff1101]">
                Get Started
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-4">
              <CustomUserMenu />
            </div>
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
