"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAddProperty } from "@/context/AddPropertyContext";
import { apiFetch } from "@/lib/api";

const tagOptions = ["Appartement", "Maison", "Studio", "Chalet"];

/**
 * Renders and validates the property's main details and submits the listing.
 *
 * @param props.onErrorsChange - Reports validation messages to the parent form.
 * @param props.onSubmittingChange - Reports whether the listing is being submitted.
 */
export default function MainForm({
  onErrorsChange,
  onSubmittingChange,
}: {
  onErrorsChange: (errors: { [key: string]: string }) => void;
  onSubmittingChange: (submitting: boolean) => void;
}) {

  const router = useRouter();
  const { formData, updateField, toggleTag } = useAddProperty();
  const [zipcode, setZipcode] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submissionError, setSubmissionError] = useState("");
  const [requiresReauthentication, setRequiresReauthentication] = useState(false);

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
    setRequiresReauthentication(false);

    try {
      await apiFetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          location: finalLocation,
        }),
      });
      router.push("/home");

    } catch (err) {
      const message = err instanceof Error
        ? err.message
        : "Impossible de contacter le serveur. Réessayez plus tard.";
      if (message.toLowerCase().includes("insufficient role")) {
        setRequiresReauthentication(true);
        setSubmissionError("Votre rôle hôte a changé, mais votre session utilise encore l’ancien jeton. Reconnectez-vous pour actualiser vos droits.");
      } else {
        setSubmissionError(message);
      }
      console.error("Property creation request failed:", err);
    } finally {
      onSubmittingChange(false);
    }
  }


  return (
    <form
      id="property-form"
      onSubmit={handleSubmit}
      noValidate
      className="flex w-full flex-col gap-6 rounded-[10px] border border-gray-light bg-white p-5 md:p-8"
      aria-labelledby="add-property-title"
    >
      {/* Main property details */}
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-[14px] font-medium">
          Titre de la propriété
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
          <label htmlFor="location" className="text-[14px] font-medium">Localisation</label>
          <input id="location" name="location" type="text" value={formData.location} onChange={(e) => updateField("location", e.target.value)} required className="h-10 rounded-[4px] border border-gray-light px-3" />
          {errors.location && <p className="text-[12px] text-red-600" aria-live="assertive">{errors.location}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="price" className="text-[14px] font-medium">Prix par nuit (€)</label>
          <input id="price" name="price_per_night" type="number" min="1" value={formData.price_per_night || ""} onChange={(e) => updateField("price_per_night", Number(e.target.value))} required className="h-10 rounded-[4px] border border-gray-light px-3" />
          {errors.price_per_night && <p className="text-[12px] text-red-600" aria-live="assertive">{errors.price_per_night}</p>}
        </div>
      </div>

      {/* Listing categories */}
      <section className="border-t border-gray-light pt-5">
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

      {submissionError && (
        <div className="flex flex-col gap-2 text-sm text-red-700" role="alert">
          <p>{submissionError}</p>
          {requiresReauthentication && (
            <Link
              href="/login?returnTo=%2Fadd-property"
              className="w-fit font-medium underline underline-offset-2"
            >
              Se reconnecter
            </Link>
          )}
        </div>
      )}
    </form>
  );
}