import Image from "next/image";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const SightLogo = () => (
  <svg
    className="h-24 w-auto"
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

export default function AboutSection() {
  return (
    <section id="about" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">About SIGHT SB CEK</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              IEEE SIGHT (Special Interest Group on Humanitarian Technology) at the College of Engineering, Karunagappally, is a dynamic group of student volunteers. We are passionate about applying our technical skills to address local humanitarian challenges, working closely with our community to develop sustainable and impactful technology-based solutions.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Globally, IEEE SIGHT is a network of groups and volunteers that partner with underserved communities to find and implement local, sustainable solutions to pressing problems. SIGHT's vision is for all people to have the opportunity to use technology to build a better future for themselves and their communities.
            </p>
            <div className="mt-12">
              <h3 className="font-headline text-2xl md:text-3xl font-bold mb-4">About IEEE SB CEK</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                IEEE Student Branch College of Engineering Karunagappally (STB 03951) is one of the oldest IEEE student branches in Kerala section, 4th branch in Travancore hub. And It is the second IEEE Student Branch in Kollam (Quilon) district. The group came into function on May 2010, in the early history of the institution. Student members of CEK take active participation in the IEEE meetings and workshops, earning many prizes and awards. The group started with Women in Engineering affinity group and now has 5 technical societies.
              </p>
            </div>
            <Link href="https://ieeesbcek.org" target="_blank" rel="noopener noreferrer">
              <Button size="lg">
                Learn More
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="order-1 md:order-2">
             <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 w-full h-[400px] p-8 flex items-center justify-center bg-muted/20">
                <SightLogo />
             </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
