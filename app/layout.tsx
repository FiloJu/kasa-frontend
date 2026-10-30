import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { MessagingProvider } from "@/context/MessagingContext";
import { serializeJsonLd, SITE_URL } from "@/lib/seo";

/** Font configuration shared by the root document. */
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-sans',
  display: 'swap',
})

/** Default metadata shared by the application routes. */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
    images: [
      {
        url: '/assets/hero-home.png',
        width: 1200,
        height: 630,
        alt: 'Kasa — Trouvez votre logement idéal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/assets/hero-home.png'],
  },
}

/** Provides the root document, shared providers, navigation, and footer. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const siteSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'Kasa',
        url: SITE_URL,
        inLanguage: 'fr-FR',
      },
      {
        '@type': 'Organization',
        name: 'Kasa',
        url: SITE_URL,
        logo: `${SITE_URL}/assets/logo-picto.svg`,
      },
    ],
  };

  return (
    <html lang="fr" className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(siteSchema) }}
        />
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