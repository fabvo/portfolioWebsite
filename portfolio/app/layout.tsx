import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fabio Voelkner - GAMEFOLIO Prototype",
  description: "Portfolio prototype in Next.js with drag&drop cards as menu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <div className="brand">Fabio Voelkner - Developer</div>
        </header>
        <main className="main">{children}</main>
      </body>
    </html>
  );
}
