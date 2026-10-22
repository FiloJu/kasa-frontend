"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { PropertyDraft } from "../types/property";

interface AddPropertyContextValue {
  formData: PropertyDraft;
  updateField: <K extends keyof PropertyDraft>(
  field: K,
  value: PropertyDraft[K]
) => void;


  // Images
  setCover: (url: string) => void;
  addPicture: (url: string) => void;

  // Equipments
  toggleEquipment: (equipment: string) => void;

  // Tags
  toggleTag: (tag: string) => void;
  addCustomTag: (tag: string) => void;

  resetForm: () => void;
}

const AddPropertyContext = createContext<AddPropertyContextValue | undefined>(
  undefined
);

export function AddPropertyProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<PropertyDraft>({
    title: "",
    description: "",
    cover: "",
    location: "",
    price_per_night: 0,
    host_id: "", // sera rempli automatiquement via l'utilisateur connecté
    pictures: [],
    equipments: [],
    tags: [],
  });

  // Mise à jour générique
  const updateField = useCallback(<K extends keyof PropertyDraft,>(
    field: K,
    value: PropertyDraft[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);


  // Images
  function setCover(url: string) {
    setFormData((prev) => ({ ...prev, cover: url }));
  }

  function addPicture(url: string) {
    setFormData((prev) => ({
      ...prev,
      pictures: [...(prev.pictures || []), url],
    }));
  }

  // Equipments
  function toggleEquipment(equipment: string) {
    setFormData((prev) => {
      const exists = prev.equipments?.includes(equipment);
      return {
        ...prev,
        equipments: exists
          ? prev.equipments?.filter((e) => e !== equipment)
          : [...(prev.equipments || []), equipment],
      };
    });
  }

  // Tags
  function toggleTag(tag: string) {
    setFormData((prev) => {
      const exists = prev.tags?.includes(tag);
      return {
        ...prev,
        tags: exists
          ? prev.tags?.filter((t) => t !== tag)
          : [...(prev.tags || []), tag],
      };
    });
  }

  function addCustomTag(tag: string) {
    const clean = tag.trim();
    if (!clean) return;

    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.includes(clean)
        ? prev.tags
        : [...(prev.tags || []), clean],
    }));
  }

  // Reset complet
  function resetForm() {
    setFormData({
      title: "",
      description: "",
      cover: "",
      location: "",
      price_per_night: 0,
      host_id: "",
      pictures: [],
      equipments: [],
      tags: [],
    });
  }

  return (
    <AddPropertyContext.Provider
      value={{
        formData,
        updateField,
        setCover,
        addPicture,
        toggleEquipment,
        toggleTag,
        addCustomTag,
        resetForm,
      }}
    >
      {children}
    </AddPropertyContext.Provider>
  );
}

export function useAddProperty() {
  const ctx = useContext(AddPropertyContext);
  if (!ctx) {
    throw new Error("useAddProperty must be used inside AddPropertyProvider");
  }
  return ctx;
}