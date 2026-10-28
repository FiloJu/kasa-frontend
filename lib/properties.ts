import { apiFetch } from "./api";
import type { Property } from "../types/property";

export async function getProperties(): Promise<Property[]> {
  return apiFetch<Property[]>("/api/properties");
}

export async function getPropertyById(id: string): Promise<Property> {
  return apiFetch<Property>(`/api/properties/${id}`);
}
