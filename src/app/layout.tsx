import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { Sidebar } from "@/components/layout/Sidebar";

const nunitoSans = Nunito_Sans({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Subscrify",
  description: "Control de suscripciones",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={cn("dark", "font-sans", nunitoSans.variable)}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-zinc-950 text-zinc-100 min-h-screen flex`}
      >
        {/* Sidebar global */}
        <Sidebar />

        {/* Contenido dinámico de la app */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="w-full space-y-6">{children}</div>
        </main>

        <Toaster theme="dark" position="bottom-right" richColors />
      </body>
    </html>
  );
}