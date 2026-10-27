import { apiFetch } from "./api";
import type { Property } from "../types/property";
import mockProperties from "../data/mock-properties.json";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
const mocks = mockProperties as Property[];

export async function getProperties(): Promise<Property[]> {
  if (USE_MOCK) return mocks;
  return apiFetch<Property[]>("/api/properties");
}

export async function getPropertyById(id: string): Promise<Property> {
  if (USE_MOCK) {
    const property = mocks.find((p) => p.id === id || p.slug === id);
    if (!property) throw new Error("Logement introuvable");
    return property;
  }
  return apiFetch<Property>(`/api/properties/${id}`);
}
