export type City =
  | "Noida"
  | "Greater Noida"
  | "Gurugram"
  | "Ghaziabad"
  | "Indirapuram"
  | "Delhi";
export type PropertyType =
  | "Apartment"
  | "Luxury apartment"
  | "Builder floor"
  | "Villa"
  | "Plot"
  | "Office"
  | "Retail";
export interface Property {
  id: string;
  name: string;
  city: City;
  locality: string;
  type: PropertyType;
  purpose: "Buy" | "Rent";
  price: number;
  bhk: number;
  area: number;
  carpet: number;
  possession: string;
  image: string;
  coordinates: [number, number];
  rent: [number, number];
  description: string;
  developer: string;
  floor: string;
  floors: string;
  facing: string;
  furnishing: string;
  parking: string;
  age: string;
  maintenance: string;
  ownership: string;
  featured?: boolean;
  investment?: boolean;
  project?: boolean;
}
export interface Filters {
  purpose: string;
  city: string;
  type: string;
  budget: string;
  bhk: string;
  ready: boolean;
}
