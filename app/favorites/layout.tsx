import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vos favoris",
  description: "Retrouvez les logements enregistrés dans vos favoris Kasa.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function FavoritesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
