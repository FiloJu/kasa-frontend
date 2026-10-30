import type { Metadata } from "next";

/** Search metadata for the sign-in route. */
export const metadata: Metadata = {
  title: "Connexion",
  description:
    "Connectez-vous à votre compte Kasa pour retrouver vos annonces et séjours.",
  alternates: {
    canonical: "/login",
  },
  robots: {
    index: false,
    follow: true,
  },
};

/** Applies the login route metadata without adding a wrapper element. */
export default function LoginLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
