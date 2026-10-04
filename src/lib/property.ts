import type { Filters, Property } from "../types/property";
export const defaultFilters: Filters = {
  purpose: "Buy",
  city: "",
  type: "",
  budget: "",
  bhk: "",
  ready: false,
};
export function money(value: number, monthly = false) {
  return (
    (value >= 10000000
      ? `₹${(value / 10000000).toFixed(2)} Cr`
      : value >= 100000
        ? `₹${Number((value / 100000).toFixed(2))} Lakh`
        : `₹${value.toLocaleString("en-IN")}`) + (monthly ? "/month" : "")
  );
}
export function filterProperties(items: Property[], f: Filters) {
  return items.filter(
    (p) =>
      (!f.purpose ||
        (f.purpose === "Commercial"
          ? ["Office", "Retail"].includes(p.type)
          : p.purpose === f.purpose)) &&
      (!f.city ||
        p.city === f.city ||
        p.locality.toLowerCase() === f.city.toLowerCase()) &&
      (!f.type || p.type === f.type) &&
      (!f.bhk || p.bhk === Number(f.bhk)) &&
      (!f.budget || p.price <= Number(f.budget)) &&
      (!f.ready || p.possession === "Ready to Move"),
  );
}
export const configuration = (p: Property) => (p.bhk ? `${p.bhk} BHK` : p.type);
export const yieldRange = (p: Property) =>
  p.rent[0] && p.purpose === "Buy"
    ? `${(((p.rent[0] * 12) / p.price) * 100).toFixed(1)}–${(((p.rent[1] * 12) / p.price) * 100).toFixed(1)}%`
    : "Not estimated";
export const phone = import.meta.env?.VITE_CONTACT_PHONE || "919762110536";
export const email =
  import.meta.env?.VITE_CONTACT_EMAIL || "mayodevs01@gmail.com";
export const phoneLabel =
  phone.length === 12
    ? `+${phone.slice(0, 2)} ${phone.slice(2, 7)} ${phone.slice(7)}`
    : `+${phone}`;
export const whatsapp = (p?: Property, text?: string) =>
  `https://wa.me/${phone}?text=${encodeURIComponent(text || (p ? `Hi, I'm interested in ${p.name}, ${p.locality}, ${p.city} listed at ${money(p.price, p.purpose === "Rent")} on RealEstate.co. I understand this is a demo listing. I'd like more details and availability.` : "Hi, I'd like help shortlisting a property in Delhi NCR. My preferred location and budget are: "))}`;
