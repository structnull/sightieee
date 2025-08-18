"use client";

import React, { useEffect, useState } from "react";
import { AnimatedTestimonials } from "../ui/aceternity/animated-testimonials";


const testimonials = [
  {
    quote:
      "",
    name: "Jane Doe",
    designation: "Chairperson",
    src: "https://placehold.co/500x500.png",
    hint: "professional portrait"
  },
  {
    quote:
      "",
    name: "John Smith",
    designation: "Vice Chairperson",
    src: "https://placehold.co/500x500.png",
    hint: "tech leader"
  },
  {
    quote:
      "",
    name: "Emily White",
    designation: "Secretary",
    src: "https://placehold.co/500x500.png",
    hint: "operations director"
  },
  {
    quote:
      "",
    name: "Michael Brown",
    designation: "Treasurer",
    src: "https://placehold.co/500x500.png",
    hint: "engineering lead"
  },
  {
    quote:
      "",
    name: "Chris Green",
    designation: "Webmaster",
    src: "https://placehold.co/500x500.png",
    hint: "technology vp"
  },
];


export default function ExecomSection() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

  return (
    <section id="execom" className="py-20 lg:py-32 bg-muted/40">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="font-headline text-3xl md:text-4xl font-bold">Meet Our Execom</h2>
                <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                    The passionate individuals driving our mission forward.
                </p>
            </div>
            {isClient && <AnimatedTestimonials testimonials={testimonials} autoplay />}
        </div>
    </section>
  );
}
