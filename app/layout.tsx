import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zenture Analyst",
  description: "App de análise de Free Fire da Zenture",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
