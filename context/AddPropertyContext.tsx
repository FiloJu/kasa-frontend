"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { PropertyDraft } from "../types/property";

/**
 * Context value type for property form data management.
 */
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

/**
 * AddPropertyProvider component that manages the property creation form state.
 * Provides methods to update form fields, manage images, equipment, and tags.
 * All form data is stored in a single state object and can be reset.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components.
 * @returns {React.ReactElement} Provider wrapping child components with form context.
 */
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

  /**
   * Generic field update function that accepts any property of PropertyDraft.
   * Allows updating a single field while preserving other fields.
   *
   * @template K - A key of PropertyDraft.
   * @param {K} field - The property name to update.
   * @param {PropertyDraft[K]} value - The new value for the property.
   */
  const updateField = useCallback(<K extends keyof PropertyDraft,>(
    field: K,
    value: PropertyDraft[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);


  /**
   * Sets the cover image (main photo) of the property.
   *
   * @param {string} url - URL of the cover image.
   */
  function setCover(url: string) {
    setFormData((prev) => ({ ...prev, cover: url }));
  }

  /**
   * Adds an additional picture to the property's gallery.
   *
   * @param {string} url - URL of the picture to add.
   */
  function addPicture(url: string) {
    setFormData((prev) => ({
      ...prev,
      pictures: [...(prev.pictures || []), url],
    }));
  }

  /**
   * Toggles an equipment on or off for the property.
   * If the equipment is already selected, it is removed; otherwise, it is added.
   *
   * @param {string} equipment - Name of the equipment to toggle.
   */
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

  /**
   * Toggles a tag on or off for the property.
   * If the tag is already selected, it is removed; otherwise, it is added.
   *
   * @param {string} tag - Name of the tag to toggle.
   */
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

  /**
   * Adds a custom user-defined tag to the property.
   * Trims whitespace and prevents adding duplicate tags or empty strings.
   *
   * @param {string} tag - The custom tag to add.
   */
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

  /**
   * Resets the entire form to its initial state.
   * Clears all fields including title, description, images, equipment, and tags.
   */
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

/**
 * Hook to access the add property context.
 *
 * @returns {AddPropertyContextValue} The add property context value.
 * @throws {Error} If used outside AddPropertyProvider.
 */
export function useAddProperty() {
  const ctx = useContext(AddPropertyContext);
  if (!ctx) {
    throw new Error("useAddProperty must be used inside AddPropertyProvider");
  }
  return ctx;
}