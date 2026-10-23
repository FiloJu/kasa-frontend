"use client";

import { useAddProperty } from "@/context/AddPropertyContext";

export default function Equipments({
  errors,
}: {
  errors: { [key: string]: string };
}) {
  const { formData, toggleEquipment } = useAddProperty();

  const equipmentsCol1 = [
    "Micro-Ondes",
    "Douche italienne",
    "Frigo",
    "WIFI",
    "Parking",
    "Sèche Cheveux",
    "Machine à laver",
    "Cuisine équipée",
    "Télévision",
    "Chambre Séparée",
    "Climatisation",
    "Frigo Américain",
  ];

  const equipmentsCol2 = [
    "Clic clac",
    "Four",
    "Rangements",
    "Lit",
    "Bouilloire",
    "SDB",
    "Toilettes sèches",
    "Cintres",
    "Baie vitrée",
    "Hotte",
    "Baignoire",
    "Vue Parc",
  ];

  return (
    <section
      aria-labelledby="equipments-title"
      className="flex w-full flex-col gap-4 rounded-[10px] border border-gray-light bg-white p-5 md:p-8"
    >
      <h2 id="equipments-title" className="text-[14px] font-medium text-black">
        Équipements
      </h2>

      <fieldset className="grid grid-cols-2 gap-x-4 gap-y-3" aria-describedby="equipments-help">
        <legend className="sr-only">Liste des équipements disponibles</legend>

        <div className="flex flex-col gap-3">
          {equipmentsCol1.map((item) => (
            <label key={item} className="flex items-center gap-2 text-[12px] text-gray-dark">
              <input
                type="checkbox"
                name="equipments"
                value={item}
                checked={formData.equipments.includes(item)}
                onChange={() => toggleEquipment(item)}
                className="h-3 w-3 accent-[#99331A]"
              />
              {item}
            </label>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {equipmentsCol2.map((item) => (
            <label key={item} className="flex items-center gap-2 text-[12px] text-gray-dark">
              <input
                type="checkbox"
                name="equipments"
                value={item}
                checked={formData.equipments.includes(item)}
                onChange={() => toggleEquipment(item)}
                className="h-3 w-3 accent-[#99331A]"
              />
              {item}
            </label>
          ))}
        </div>
      </fieldset>

      {errors.equipments && (
        <p className="text-[12px] text-red-600" aria-live="assertive">
          {errors.equipments}
        </p>
      )}

      <p id="equipments-help" className="sr-only">
        Sélectionnez les équipements présents dans votre logement.
      </p>
    </section>
  );
}