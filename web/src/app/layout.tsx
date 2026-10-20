/**
 * The outer frame of every page: fonts, page title, dark background,
 * and AuthProvider (remembers who is logged in).
 */
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { AuthProvider } from "@/components/auth/AuthProvider";
import "./globals.css";

// Body text font
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Headings and big numbers font
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Coach",
  description: "Real-time AI workout coach that counts reps and corrects your form.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-ground font-sans text-ink">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
