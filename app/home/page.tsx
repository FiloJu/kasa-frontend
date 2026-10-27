import Hero from "../../components/HeroSection";
import PropertiesList from "../../components/PropertiesList";
import Instructions from "../../components/Instructions";

export const metadata = {
  title: "Kasa – Locations d’hébergements partout en France",
  description:
    "Trouvez des logements uniques, confortables et vérifiés partout en France. Réservez facilement votre prochain séjour avec Kasa.",
  alternates: {
    canonical: "https://kasa-three-xi.vercel.app",
  },
  openGraph: {
    title: "Kasa – Locations d’hébergements partout en France",
    description:
      "Trouvez des logements uniques, confortables et vérifiés partout en France.",
    url: "https://kasa-three-xi.vercel.app",
    siteName: "Kasa",
    images: [
      {
        url: "https://kasa-three-xi.vercel.app/assets/hero-home.png",
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
    images: ["https://kasa-three-xi.vercel.app/assets/hero-home.png"],
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Kasa",
            url: "https://kasa-three-xi.vercel.app",
            potentialAction: {
              "@type": "SearchAction",
              target:
                "https://kasa-three-xi.vercel.app/home?search={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Kasa",
            url: "https://kasa-three-xi.vercel.app",
            logo: "https://kasa-three-xi.vercel.app/assets/logo-picto.svg",
          }),
        }}
      />

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