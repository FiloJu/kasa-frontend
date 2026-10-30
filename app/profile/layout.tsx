import type { Metadata } from "next";

/** Prevents private profile content from being indexed by search engines. */
export const metadata: Metadata = {
  title: "Mon profil",
  description: "Consultez les informations de votre compte Kasa.",
  robots: {
    index: false,
    follow: false,
  },
};

/** Applies the profile route metadata without adding a wrapper element. */
export default function ProfileLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
