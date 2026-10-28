import type { Metadata } from "next";
import PropertiesList from "../../components/PropertiesList";

export const metadata: Metadata = {
  title: "Tous les logements",
  description:
    "Parcourez les hébergements proposés par des particuliers partout en France et trouvez le logement idéal pour votre séjour.",
  alternates: {
    canonical: "/properties",
  },
};

export default function PropertiesPage() {
  return <PropertiesList />;
}