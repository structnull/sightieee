"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";

// IEEE SIGHT Logo
const SightLogo = () => (
    <svg
      className="h-12 w-auto"
      viewBox="0 0 250 80"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <g>
        <text
          fontFamily="Arial, sans-serif"
          fontSize="32"
          fontWeight="bold"
          className="fill-foreground"
        >
          <tspan x="0" y="35">IEEE</tspan>
        </text>
        <text
          fontFamily="Arial, sans-serif"
          fontSize="32"
          fontWeight="normal"
          className="fill-accent-foreground"
        >
          <tspan x="85" y="35">SIGHT</tspan>
        </text>
        <rect
          x="0"
          y="45"
          width="250"
          height="2"
          className="fill-foreground"
        />
        <text
          fontFamily="Arial, sans-serif"
          fontSize="14"
          fontWeight="normal"
          className="fill-accent-foreground"
        >
          <tspan x="0" y="65">Special Interest Group on</tspan>
          <tspan x="0" y="80">Humanitarian Technology</tspan>
        </text>
      </g>
    </svg>
);

export default function Header() {
  const navItems = [
    { name: "About", href: "#about" },
    { name: "Execom", href: "#execom" },
    { name: "Activities", href: "#activities" },
    { name: "Achievements", href: "#achievements" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="mr-6 flex items-end space-x-4">
          <SightLogo />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
           <div className="hidden md:block">
            <ThemeToggle />
           </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="p-6 border-b">
                 <Link href="/" className="flex items-center space-x-2">
                    <SightLogo />
                  </Link>
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <SheetDescription className="sr-only">Main navigation menu</SheetDescription>
              </SheetHeader>
              <div className="grid gap-6 p-6">
                <nav className="grid gap-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="py-2 text-lg font-semibold transition-colors hover:text-primary"
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto">
                    <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
