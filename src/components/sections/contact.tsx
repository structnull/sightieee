
"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitContactForm, type FormState } from "@/lib/actions";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { BackgroundBeamsStatic } from "../ui/aceternity/background-beams-static";
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin, Phone } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { motion } from "framer-motion";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Sending..." : "Send Message"}
        </Button>
    );
}

const ContactForm = () => {
    const initialState: FormState = { message: "", success: false };
    const [state, formAction] = useActionState(submitContactForm, initialState);
    const { toast } = useToast();

    useEffect(() => {
        if (state.message) {
            if (state.success) {
                toast({
                    title: "Success!",
                    description: state.message,
                });
            } else {
                toast({
                    title: "Error",
                    description: state.message,
                    variant: "destructive",
                });
            }
        }
    }, [state, toast]);

    return (
        <Card className="bg-background/80 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="font-headline">Send us a message</CardTitle>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" placeholder="Your Name" required />
                        {state.errors?.name && <p className="text-sm font-medium text-destructive">{state.errors.name[0]}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" placeholder="your.email@example.com" required />
                        {state.errors?.email && <p className="text-sm font-medium text-destructive">{state.errors.email[0]}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" name="message" placeholder="Your message..." required minLength={10} />
                        {state.errors?.message && <p className="text-sm font-medium text-destructive">{state.errors.message[0]}</p>}
                    </div>
                    <SubmitButton />
                </form>
            </CardContent>
        </Card>
    );
};

const ContactFormSkeleton = () => {
    return (
        <Card className="bg-background/80 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="font-headline">Send us a message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-20 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
    )
}

export default function ContactSection() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const FADE_UP_ANIMATION_VARIANTS = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { type: "spring" } },
      };

    return (
        <section id="contact" className="relative py-20 lg:py-32 overflow-hidden">
             <motion.div 
                initial="hidden"
                whileInView="show"
                variants={FADE_UP_ANIMATION_VARIANTS}
                viewport={{ once: true }}
                className="container mx-auto px-4 z-10 relative"
            >
                <div className="text-center mb-12">
                    <h2 className="font-headline text-3xl md:text-4xl font-bold">Get In Touch</h2>
                    <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                        Have a question, a project idea, or want to collaborate? We'd love to hear from you.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 gap-12">
                    {isClient ? <ContactForm /> : <ContactFormSkeleton />}
                    <div className="space-y-8 text-foreground">
                        <h3 className="font-headline text-2xl font-semibold">Contact Information</h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-primary/10 p-3 rounded-full">
                                    <Mail className="h-6 w-6 text-primary-foreground dark:text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">Email</h4>
                                    <a href="mailto:sight@ieeesbcek.org" className="text-muted-foreground hover:text-primary-foreground transition-colors">
                                        sight@ieeesbcek.org
                                    </a>
                                </div>
                            </div>
                             <div className="flex items-start gap-4">
                                <div className="bg-primary/10 p-3 rounded-full">
                                    <Phone className="h-6 w-6 text-primary-foreground dark:text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">Phone</h4>
                                    <p className="text-muted-foreground">(+91) 123-456-7890</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-primary/10 p-3 rounded-full">
                                    <MapPin className="h-6 w-6 text-primary-foreground dark:text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">Location</h4>
                                    <p className="text-muted-foreground">College of Engineering, Karunagappally<br />Kerala, India</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
            <BackgroundBeamsStatic />
        </section>
    );
}
