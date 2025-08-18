import { Instagram, Linkedin, Mail, Twitter } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";

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

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);
FacebookIcon.displayName = "Facebook";

export default function Footer() {
  const socialLinks = [
    { icon: Twitter, href: "https://x.com/IEEE_SB_CEK", name: "X" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/ieeesbcek/", name: "LinkedIn" },
    { icon: Instagram, href: "https://www.instagram.com/ieee_sb_cek/", name: "Instagram" },
    { icon: FacebookIcon, href: "https://www.facebook.com/ieeeceksb/", name: "Facebook" },
    { icon: Mail, href: "mailto:sight@ieeesbcek.org", name: "Mail" },
  ];

  const navLinks = [
      { name: "About", href: "#about" },
      { name: "Execom", href: "#execom" },
      { name: "Activities", href: "#activities" },
      { name: "Achievements", href: "#achievements" },
      { name: "Contact", href: "#contact" },
  ];

  return (
    <footer className="bg-muted/40 border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4 md:col-span-2">
            <Link href="/" className="flex items-end gap-6">
                <Image src="https://ieeesbcek.org/images/ieee.png" alt="IEEE Logo" width={100} height={40} className="h-12 w-auto invert dark:invert-0" />
                <SightLogo />
            </Link>
          </div>

          <div>
            <h3 className="font-headline font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-headline font-semibold mb-4">Follow Us</h3>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((link, index) => (
                <Link href={link.href} key={index} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" aria-label={`Follow us on ${link.name}`}>
                    <link.icon className="h-5 w-5" />
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} IEEE SIGHT SB CEK. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
