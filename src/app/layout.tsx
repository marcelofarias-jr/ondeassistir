import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://ondeassistir.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "OndeAssistir — Onde assistir filmes e séries no Brasil",
    template: "%s — OndeAssistir",
  },
  description:
    "Descubra em qual streaming você pode assistir seus filmes, séries e documentários favoritos no Brasil. Dados cruzados de JustWatch, Watchmode e Streaming Availability.",
  keywords: [
    "streaming",
    "filmes",
    "séries",
    "Brasil",
    "onde assistir",
    "Netflix",
    "Prime Video",
    "Disney+",
  ],
  authors: [{ name: "OndeAssistir" }],
  creator: "OndeAssistir",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: BASE_URL,
    siteName: "OndeAssistir",
    title: "OndeAssistir — Onde assistir filmes e séries no Brasil",
    description:
      "Descubra em qual streaming você pode assistir seus filmes, séries e documentários favoritos no Brasil.",
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: "OndeAssistir" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OndeAssistir",
    description: "Descubra onde assistir filmes e séries no Brasil.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${poppins.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-black">
        <Header />
        <main id="main-content" role="main" className="flex-1 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
