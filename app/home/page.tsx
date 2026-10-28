import type { Metadata } from "next";
import Hero from "../../components/HeroSection";
import PropertiesList from "../../components/PropertiesList";
import Instructions from "../../components/Instructions";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Kasa – Locations d’hébergements partout en France",
  description:
    "Trouvez des logements uniques, confortables et vérifiés partout en France. Réservez facilement votre prochain séjour avec Kasa.",
  alternates: {
    canonical: "/home",
  },
  openGraph: {
    title: "Kasa – Locations d’hébergements partout en France",
    description:
      "Trouvez des logements uniques, confortables et vérifiés partout en France.",
    url: `${SITE_URL}/home`,
    siteName: "Kasa",
    images: [
      {
        url: `${SITE_URL}/assets/hero-home.png`,
        width: 1200,
        height: 630,
        alt: "Kasa – Trouvez votre logement idéal",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kasa – Locations d’hébergements partout en France",
    description:
      "Trouvez des logements uniques, confortables et vérifiés partout en France.",
    images: [`${SITE_URL}/assets/hero-home.png`],
  },
};

export default function Home() {
  return (
    <>
      <Hero />

      <section className="mt-4" aria-labelledby="properties-title">
        <h2 id="properties-title" className="sr-only">
          Liste des logements disponibles
        </h2>

        <div className="max-w-278.75 mx-auto">
          <PropertiesList />
        </div>
      </section>

      <Instructions />
    </>
  );
}