import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mon profil",
  description: "Consultez les informations de votre compte Kasa.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfileLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
