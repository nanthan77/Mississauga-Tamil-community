import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { MemberProvider } from "@/contexts/MemberContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mississauga Tamils Association | மிசிசாகா தமிழ் சங்கம்",
  description: "Connecting Tamil Community in Mississauga & Peel Region. Join us for cultural events, community services, and more. | மிசிசாகா மற்றும் பீல் பகுதியில் தமிழ் சமூகத்தை இணைக்கிறது.",
  keywords: "Tamil, Mississauga, Tamil Association, Tamil Community, Peel Region, Tamil Events, Tamil Culture, Canadian Tamils, GTA Tamils",
  authors: [{ name: "Mississauga Tamils Association" }],
  openGraph: {
    title: "Mississauga Tamils Association",
    description: "Connecting Tamil Community in Mississauga & Peel Region",
    type: "website",
    locale: "en_CA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-slate-900 text-slate-100`}
      >
        <LanguageProvider>
          <AdminProvider>
            <MemberProvider>
              {children}
            </MemberProvider>
          </AdminProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
