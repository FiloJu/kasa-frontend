import { apiFetch } from "./api";
import type { Property } from "../types/property";
import mockProperties from "../data/mock-properties.json";

// In production on Vercel, use mock data since backend is complex to serverless
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true" || process.env.NODE_ENV === "production";
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
