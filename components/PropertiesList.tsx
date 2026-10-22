import { getProperties } from "@/lib/properties";
import { Property } from "@/app/types/property";
import PropertyCard from "./PropertyCard";

export default async function PropertiesList() {

  let properties: Property[] = [];

  try {
    properties = await getProperties();
  } catch {
    return (
      <p className="text-center text-main-red text-lg mt-4" role="alert">
        Impossible de charger les logements.
      </p>
    );
  }

  return (
    <section
        className="flex flex-wrap justify-start gap-6 mt-6 max-w-88.75 lg:max-w-278.75 md:max-w-183.5 mx-auto"
      aria-label="Liste des logements disponibles"
    >
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </section>
  );
}