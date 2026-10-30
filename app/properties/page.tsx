import type { Metadata } from "next";
import PropertiesList from "../../components/PropertiesList";

/** Search metadata for the property listing page. */
export const metadata: Metadata = {
  title: "Tous les logements",
  description:
    "Parcourez les hébergements proposés par des particuliers partout en France et trouvez le logement idéal pour votre séjour.",
  alternates: {
    canonical: "/properties",
  },
};

/** Renders the list of available properties. */
export default function PropertiesPage() {
  return <PropertiesList />;
}