import type { Metadata } from "next";

/** Prevents private favorites content from being indexed by search engines. */
export const metadata: Metadata = {
  title: "Vos favoris",
  description: "Retrouvez les logements enregistrés dans vos favoris Kasa.",
  robots: {
    index: false,
    follow: false,
  },
};

/** Applies the favorites route metadata without adding a wrapper element. */
export default function FavoritesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
