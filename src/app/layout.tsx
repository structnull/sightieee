import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import CustomCursor from "@/components/ui/custom-cursor";

export const metadata: Metadata = {
  title: "IEEE SIGHT SB CEK",
  description: "Official landing page for the IEEE SB CEK SIGHT (Special Interest Group on Humanitarian Technology) chapter.",
  openGraph: {
    title: "IEEE SIGHT SB CEK",
    description: "Official landing page for the IEEE SB CEK SIGHT (Special Interest Group on Humanitarian Technology) chapter.",
    url: "https://ieee-sight-sb-cek.vercel.app", // Replace with your actual domain
    siteName: "SIGHT Landing",
    images: [
      {
        url: "https://placehold.co/1200x630.png", // Replace with your actual OG image
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IEEE SIGHT SB CEK",
    description: "Official landing page for the IEEE SB CEK SIGHT (Special Interest Group on Humanitarian Technology) chapter.",
    images: ["https://placehold.co/1200x630.png"], // Replace with your actual Twitter image
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <CustomCursor />
        </ThemeProvider>
      </body>
    </html>
  );
}
