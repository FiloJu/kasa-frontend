"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAddProperty } from "@/context/AddPropertyContext";

const equipmentOptions = ["Wi-Fi", "Cuisine équipée", "Parking", "Télévision"];
const tagOptions = ["Appartement", "Maison", "Studio", "Chalet"];

export default function MainForm({
  onErrorsChange,
  onSubmittingChange,
}: {
  onErrorsChange: (errors: { [key: string]: string }) => void;
  onSubmittingChange: (submitting: boolean) => void;
}) {

  const router = useRouter();
  const { formData, updateField, toggleEquipment, toggleTag } = useAddProperty();
  const [zipcode, setZipcode] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submissionError, setSubmissionError] = useState("");

  function validate() {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) newErrors.title = "Le titre est obligatoire.";
    if (!formData.description.trim())
      newErrors.description = "La description est obligatoire.";

    if (!formData.price_per_night || formData.price_per_night <= 0)
      newErrors.price_per_night = "Le prix doit être supérieur à 0.";
    if (!formData.location.trim())
      newErrors.location = "La localisation est obligatoire.";
    if (!zipcode.trim()) newErrors.zipcode = "Le code postal est obligatoire.";
    if (!formData.cover.trim())
      newErrors.cover = "Une photo de couverture est obligatoire.";
    if (formData.pictures.length === 0)
      newErrors.pictures = "Veuillez ajouter au moins une photo.";
    if (formData.equipments.length === 0)
      newErrors.equipments = "Veuillez sélectionner au moins un équipement.";
    if (formData.tags.length === 0)
      newErrors.tags = "Veuillez sélectionner au moins une catégorie.";

    setErrors(newErrors);
    onErrorsChange(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    const finalLocation = `${zipcode} ${formData.location}`;
    onSubmittingChange(true);
    setSubmissionError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          location: finalLocation,
        }),
      });


      if (!res.ok) {
        setSubmissionError("La création du logement a échoué. Vérifiez les informations et réessayez.");
        console.error("Property creation failed:", await res.text());
        return;
      }

      await res.json();
      router.push("/home");

    } catch (err) {
      setSubmissionError("Impossible de contacter le serveur. Réessayez plus tard.");
      console.error("Property creation request failed:", err);
    } finally {
      onSubmittingChange(false);
    }
  }


  return (
    <form
      id="property-form"
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-6 rounded-[10px] border border-gray-light bg-white p-5 md:p-8"
      aria-labelledby="add-property-title"
    >
      {/* Main property details */}
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-[14px] font-medium">
          Titre
        </label>

        <input
          id="title"
          type="text"
          value={formData.title}
          placeholder="Ex : Appartement cosy au cœur de Paris"
          onChange={(e) => updateField("title", e.target.value)}
          required
          aria-required="true"
          aria-invalid="false"
          
          className="text-[12px] text-gray-dark border border-gray-light rounded-[4px] px-3 lg:w-104 h-10"
        />

        {errors.title && (
          <p id="error-title" className="text-red-500 text-[12px]" aria-live="assertive">
            {errors.title}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-[14px] font-medium">
          Description
        </label>

        <textarea
          id="description"
          value={formData.description || ""}
          placeholder="Décrivez votre propriété en détail…"
          onChange={(e) => updateField("description", e.target.value)}
          required
          className="text-[12px] text-gray-dark border border-gray-light rounded-[4px] px-3 py-2 lg:w-104 h-30"
        />

        {errors.description && (
          <p className="text-red-500 text-[12px]" aria-live="assertive">
            {errors.description}
          </p>
        )}

      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="zipcode" className="text-[14px] font-medium">Code postal</label>
          <input id="zipcode" type="text" inputMode="numeric" value={zipcode} onChange={(e) => setZipcode(e.target.value)} required className="h-10 rounded-[4px] border border-gray-light px-3" />
          {errors.zipcode && <p className="text-[12px] text-red-600" aria-live="assertive">{errors.zipcode}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="location" className="text-[14px] font-medium">Ville et quartier</label>
          <input id="location" name="location" type="text" value={formData.location} onChange={(e) => updateField("location", e.target.value)} required className="h-10 rounded-[4px] border border-gray-light px-3" />
          {errors.location && <p className="text-[12px] text-red-600" aria-live="assertive">{errors.location}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="price" className="text-[14px] font-medium">Prix par nuit (€)</label>
          <input id="price" name="price_per_night" type="number" min="1" value={formData.price_per_night || ""} onChange={(e) => updateField("price_per_night", Number(e.target.value))} required className="h-10 rounded-[4px] border border-gray-light px-3" />
          {errors.price_per_night && <p className="text-[12px] text-red-600" aria-live="assertive">{errors.price_per_night}</p>}
        </div>
      </div>

      {/* Listing images */}
      <section className="flex flex-col gap-4 border-t border-gray-light pt-5" aria-labelledby="images-title">
        <h2 id="images-title" className="text-[18px] font-semibold">Photos</h2>
        <div className="flex flex-col gap-1">
          <label htmlFor="cover" className="text-[14px] font-medium">URL de la photo de couverture</label>
          <input id="cover" type="url" value={formData.cover} onChange={(e) => updateField("cover", e.target.value)} required className="h-10 rounded-[4px] border border-gray-light px-3" />
          {errors.cover && <p className="text-[12px] text-red-600" aria-live="assertive">{errors.cover}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="pictures" className="text-[14px] font-medium">Photos supplémentaires</label>
          <textarea id="pictures" value={formData.pictures.join("\n")} onChange={(e) => updateField("pictures", e.target.value.split("\n").map((url) => url.trim()).filter(Boolean))} placeholder="Une URL d’image par ligne" rows={3} className="rounded-[4px] border border-gray-light px-3 py-2" />
          {errors.pictures && <p className="text-[12px] text-red-600" aria-live="assertive">{errors.pictures}</p>}
        </div>
      </section>

      {/* Equipment and categories */}
      <section className="grid gap-6 border-t border-gray-light pt-5 md:grid-cols-2">
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-2 text-[18px] font-semibold">Équipements</legend>
          {equipmentOptions.map((equipment) => (
            <label key={equipment} className="flex items-center gap-2 text-[14px]">
              <input type="checkbox" checked={formData.equipments.includes(equipment)} onChange={() => toggleEquipment(equipment)} className="accent-[#99331A]" />
              {equipment}
            </label>
          ))}
          {errors.equipments && <p className="text-[12px] text-red-600" aria-live="assertive">{errors.equipments}</p>}
        </fieldset>

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-2 text-[18px] font-semibold">Catégories</legend>
          {tagOptions.map((tag) => (
            <label key={tag} className="flex items-center gap-2 text-[14px]">
              <input type="checkbox" checked={formData.tags.includes(tag)} onChange={() => toggleTag(tag)} className="accent-[#99331A]" />
              {tag}
            </label>
          ))}
          {errors.tags && <p className="text-[12px] text-red-600" aria-live="assertive">{errors.tags}</p>}
        </fieldset>
      </section>

      {submissionError && <p className="text-sm text-red-600" role="alert">{submissionError}</p>}
    </form>
  );
}