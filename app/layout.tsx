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
  title: "Party Host",
  description:
    "Plan the perfect party with ease! Create custom lists for food, drinks, and decor, and let guests sign up to bring what you need. Simplify your party planning today.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <GoogleTagManager gtmId="G-MXF61DJYTR" />

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
      </body>
    </html>
  );
}
