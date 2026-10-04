import { Search, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cities } from "../data/properties";
import { defaultFilters } from "../lib/property";
import type { Filters } from "../types/property";
export function FilterFields({
  filters: f,
  onChange,
  compact = false,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  compact?: boolean;
}) {
  const set = (key: keyof Filters, value: string) =>
    onChange({ ...f, [key]: value });
  return (
    <>
      <label>
        Location
        <select
          aria-label="Location"
          value={f.city}
          onChange={(e) => set("city", e.target.value)}
        >
          <option value="">All Delhi NCR</option>
          {cities.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <label>
        Property type
        <select
          aria-label="Property type"
          value={f.type}
          onChange={(e) => set("type", e.target.value)}
        >
          <option value="">All properties</option>
          {[
            "Apartment",
            "Luxury apartment",
            "Builder floor",
            "Villa",
            "Plot",
            "Office",
            "Retail",
          ].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <label>
        Budget
        <select
          aria-label="Budget"
          value={f.budget}
          onChange={(e) => set("budget", e.target.value)}
        >
          <option value="">Any budget</option>
          {(f.purpose === "Rent"
            ? [
                [40000, "Up to ₹40,000"],
                [60000, "Up to ₹60,000"],
                [100000, "Up to ₹1 Lakh"],
                [150000, "Up to ₹1.5 Lakh"],
              ]
            : [
                [10000000, "Up to ₹1 Cr"],
                [20000000, "Up to ₹2 Cr"],
                [30000000, "Up to ₹3 Cr"],
                [60000000, "Up to ₹6 Cr"],
              ]
          ).map(([v, t]) => (
            <option key={v} value={v}>
              {t}
            </option>
          ))}
        </select>
      </label>
      <label>
        BHK
        <select
          aria-label="BHK"
          value={f.bhk}
          onChange={(e) => set("bhk", e.target.value)}
        >
          <option value="">Any BHK</option>
          {[2, 3, 4].map((n) => (
            <option key={n} value={n}>
              {n} BHK
            </option>
          ))}
        </select>
      </label>
      {compact && (
        <label className="check-label">
          <input
            type="checkbox"
            checked={f.ready}
            onChange={(e) => onChange({ ...f, ready: e.target.checked })}
          />
          Ready to move
        </label>
      )}
    </>
  );
}
export default function PropertySearch() {
  const [filters, setFilters] = useState(defaultFilters);
  const navigate = useNavigate();
  return (
    <form
      className="hero-search"
      onSubmit={(e) => {
        e.preventDefault();
        navigate(
          "/properties?" +
            new URLSearchParams(
              Object.entries(filters)
                .filter(([k, v]) => k !== "ready" && !!v)
                .map(([k, v]) => [k, String(v)]),
            ),
        );
      }}
    >
      <div
        className="search-tabs"
        role="group"
        aria-label="Property transaction"
      >
        {["Buy", "Rent", "Commercial"].map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={filters.purpose === t}
            className={filters.purpose === t ? "active" : ""}
            onClick={() => setFilters({ ...filters, purpose: t, budget: "" })}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="search-fields">
        <FilterFields filters={filters} onChange={setFilters} />
      </div>
      <button className="button search-submit">
        <Search size={17} />
        Search properties
        <ArrowRight size={18} />
      </button>
    </form>
  );
}
