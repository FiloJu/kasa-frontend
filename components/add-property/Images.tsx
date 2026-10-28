"use client";

import { useState } from "react";
import Image from "next/image";
import { useAddProperty } from "@/context/AddPropertyContext";
import { apiFetch } from "@/lib/api";

type UploadResponse = {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
  purpose: string;
};

export default function Images({
  errors,
  onUploadingChange,
}: {
  errors: { [key: string]: string };
  onUploadingChange: (uploading: boolean) => void;
}) {
  const { formData, updateField } = useAddProperty();
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploading, setUploading] = useState(false);

  async function uploadImage(
    event: React.ChangeEvent<HTMLInputElement>,
    purpose: "property-cover" | "property-picture"
  ) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;

    setUploading(true);
    onUploadingChange(true);
    setUploadError("");
    setUploadMessage(purpose === "property-cover"
      ? "Téléchargement de l’image de couverture…"
      : "Téléchargement de l’image…");

    try {
      const body = new FormData();
      body.append("file", file);
      body.append("purpose", purpose);

      const uploaded = await apiFetch<UploadResponse>("/api/uploads/image", {
        method: "POST",
        body,
      });

      if (purpose === "property-cover") {
        updateField("cover", uploaded.url);
        setUploadMessage("Image de couverture ajoutée.");
      } else {
        updateField("pictures", [...formData.pictures, uploaded.url]);
        setUploadMessage("Image ajoutée à la galerie.");
      }
    } catch (uploadFailure) {
      setUploadMessage("");
      setUploadError(
        uploadFailure instanceof Error
          ? uploadFailure.message
          : "L’envoi de l’image a échoué. Réessayez."
      );
    } finally {
      input.value = "";
      setUploading(false);
      onUploadingChange(false);
    }
  }

  function removeImage(url: string) {
    const newList = formData.pictures.filter((image) => image !== url);
    updateField("pictures", newList);

    if (formData.cover === url) {
      updateField("cover", "");
    }
  }

  return (
    <section
      aria-labelledby="property-images-title"
      className="flex w-full flex-col gap-4 rounded-[10px] border border-gray-light bg-white p-5 md:p-8"
    >
      <h2 id="property-images-title" className="sr-only">
        Images de la propriété
      </h2>

      <div aria-live="polite" className="text-[12px] text-gray-dark" role="status">
        {uploadMessage}
      </div>
      {uploadError && <p className="text-[12px] text-red-600" role="alert">{uploadError}</p>}

      <div className="flex w-full flex-col gap-5">
        <div className="flex flex-col gap-1">
          <label htmlFor="cover-upload" className="text-[14px] font-medium text-black">
            Image de couverture
          </label>

          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              id="cover-upload"
              disabled={uploading}
              className="hidden"
              onChange={(event) => void uploadImage(event, "property-cover")}
            />

            <input
              type="text" 
              aria-label="Aucune image sélectionnée pour la couverture"           
              value={formData.cover ? "Image sélectionnée" : ""}
              readOnly
              className="h-10 min-w-0 flex-1 rounded-[4px] border border-gray-light bg-white px-3 text-[12px] text-gray-dark"
            />

            <button
              type="button"
              onClick={() => document.getElementById("cover-upload")?.click()}
              aria-label="Ajouter une image de couverture"
              disabled={uploading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[5px] bg-main-red text-[18px] font-bold text-white transition hover:bg-dark-orange disabled:cursor-wait disabled:opacity-60"
            >
              +
            </button>
          </div>

          {errors.cover && (
            <p className="text-red-500 text-[12px]" aria-live="assertive">
              {errors.cover}
            </p>
          )}

          {formData.cover && (
            <div className="relative mt-2 h-32 w-52 overflow-hidden rounded-[8px] border border-gray-light">
              <Image
                src={formData.cover}
                alt="Image de couverture"
                width={200}
                height={120}
                className="w-full h-full object-cover"
              />

              <button
                type="button"
                onClick={() => updateField("cover", "")}
                aria-label="Supprimer l’image de couverture"
                className="absolute right-2 top-2 rounded-full bg-main-red px-2 py-1 text-xs font-medium text-white hover:bg-dark-orange"
              >
                Retirer
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-[14px] font-medium text-black">Images du logement</h3>

          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              id="picture-upload"
              disabled={uploading}
              className="hidden"
              onChange={(event) => void uploadImage(event, "property-picture")}
            />

            <input
              type="text"
              aria-label="Aucune image sélectionnée pour les images du logement"
              value={formData.pictures?.length ? "Images sélectionnées" : ""}
              readOnly
              className="h-10 min-w-0 flex-1 rounded-[4px] border border-gray-light bg-white px-3 text-[12px] text-gray-dark"
            />


            <button
              type="button"
              onClick={() => document.getElementById("picture-upload")?.click()}
              aria-label="Ajouter une image du logement"
              disabled={uploading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[5px] bg-main-red text-[18px] font-bold text-white transition hover:bg-dark-orange disabled:cursor-wait disabled:opacity-60"
            >
              +
            </button>
          </div>

          {errors.pictures && (
            <p className="text-red-500 text-[12px]" aria-live="assertive">
              {errors.pictures}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            {formData.pictures.map((pic, index) => (
              <div
                key={`${pic}-${index}`}
                className="relative h-20 w-20 overflow-hidden rounded-[8px] border border-gray-light"
              >
                <Image
                  src={pic}
                  alt={`Image ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />

                <button
                  type="button"
                  onClick={() => removeImage(pic)}
                  aria-label="Supprimer cette image"
                  className="absolute right-1 top-1 rounded-full bg-main-red px-1.5 py-1 text-[10px] text-white hover:bg-dark-orange"
                >
                  X
                </button>
              </div>
            ))}
          </div>

          <label
            htmlFor="picture-upload"
            className={`text-[14px] font-normal ${uploading ? "cursor-wait opacity-60" : "cursor-pointer text-main-red"}`}
          >
            + Ajouter une image
          </label>
        </div>
      </div>
    </section>
  );
}