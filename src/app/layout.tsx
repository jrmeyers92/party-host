import Nav from "@/components/Nav";
import { Toaster } from "@/components/ui/toaster";
import { GoogleTagManager } from "@next/third-parties/google";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";

import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Wat Can I Bring",
  description:
    "Plan the perfect party with ease! Create custom lists for food, drinks, and decor, and let guests sign up to bring what you need. Simplify your party planning today.",
  keywords:
    "party planning, event planning, party host, party lists, party decor, party food, party drinks",
  openGraph: {
    title: "Wat Can I Bring",
    description:
      "Plan the perfect party with ease! Create custom lists for food, drinks, and decor, and let guests sign up to bring what you need. Simplify your party planning today.",
    type: "website",
    url: new URL(defaultUrl),
    images: [
      {
        url: "https://kwtcoagmhswockdqbwij.supabase.co/storage/v1/object/public/pub/watCanIBringPic.png",
        width: 1200,
        height: 630,
        alt: "Screenshot of an event on watcanibring.com",
      },
    ],
    site_name: "Wat Can I Bring",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wat Can I Bring",
    description:
      "Plan the perfect party with ease! Create custom lists for food, drinks, and decor, and let guests sign up to bring what you need. Simplify your party planning today.",
    images: [
      {
        url: "https://kwtcoagmhswockdqbwij.supabase.co/storage/v1/object/public/pub/watCanIBringPic.png",
        alt: "Screenshot of an event on watcanibring.com",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen">
            <Nav />
            <div className="container">{children}</div>
          </main>
        </ThemeProvider>
        <Toaster />
        <GoogleTagManager gtmId="G-MXF61DJYTR" />
      </body>
    </html>
  );
}
