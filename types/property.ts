/** Host details attached to a property listing. */
export type Host = {
  id: number;
  name: string;
  picture: string;
};

/** Property details used by listing, detail, and favorite views. */
export type Property = {
  id: string;
  slug: string;
  title: string;
  description: string;
  cover: string;
  location: string;
  price_per_night: number;
  rating_avg: number;
  ratings_count: number;
  host: Host;
  pictures?: string[];
  equipments?: string[];
  tags?: string[];
};

/** Fields submitted when creating a property listing. */
export type PropertyDraft = {
  title: string;
  description: string;
  cover: string;
  location: string;
  price_per_night: number;
  host_id: string;
  pictures: string[];
  equipments: string[];
  tags: string[];
};