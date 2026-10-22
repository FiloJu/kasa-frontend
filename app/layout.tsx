import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/app/context/AuthContext";
import { FavoritesProvider } from "@/app/context/FavoritesContext";
import { MessagingProvider } from "@/app/context/MessagingContext";

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Kasa — Location entre particuliers',
    template: '%s | Kasa',
  },
  description: 'Kasa vous aide à trouver un hébergement chaleureux partout en France. Location entre particuliers, réservation simple et sécurisée.',
  icons: {
    icon: '/icons/picto.svg',
    apple: '/icons/picto.svg',
  },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Kasa',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        <Suspense fallback={null}>
          <AuthProvider>
            <FavoritesProvider>
              <MessagingProvider>
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </MessagingProvider>
            </FavoritesProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}