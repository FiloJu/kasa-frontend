import { apiFetch } from "./api";
import type { Property } from "./types";

export function getProperties(): Promise<Property[]> {
  return apiFetch<Property[]>("/api/properties");
}

export function getPropertyById(id: string): Promise<Property> {
  return apiFetch<Property>(`/api/properties/${id}`);
}