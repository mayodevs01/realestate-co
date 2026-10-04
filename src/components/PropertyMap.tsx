import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin, MessageCircle, X } from "lucide-react";
import "maplibre-gl/dist/maplibre-gl.css";
import { createMapProvider, type MapProvider } from "../lib/map-provider";
import { properties } from "../data/properties";
import {
  defaultFilters,
  filterProperties,
  money,
  configuration,
  yieldRange,
  whatsapp,
} from "../lib/property";
import { FilterFields } from "./PropertySearch";
import type { Property } from "../types/property";
export function PropertyPreview({
  property: p,
  onClose,
}: {
  property: Property;
  onClose: () => void;
}) {
  return (
    <div className="map-preview">
      <button
        className="preview-close"
        onClick={onClose}
        aria-label="Close property preview"
      >
        <X size={16} />
      </button>
      <span className="eyebrow">DEMO LISTING · CHECK AVAILABILITY</span>
      <h3>{p.name}</h3>
      <p>
        {p.locality}, {p.city}
      </p>
      <strong>{money(p.price, p.purpose === "Rent")}</strong>
      <p>
        {configuration(p)} · {p.area.toLocaleString("en-IN")} sq.ft.
      </p>
      {p.rent[0] > 0 && p.purpose === "Buy" && (
        <div className="yield-pair">
          <span>
            Estimated monthly rent
            <b>
              {money(p.rent[0])}–{money(p.rent[1])}
            </b>
          </span>
          <span>
            Approx. gross yield<b>{yieldRange(p)}</b>
          </span>
        </div>
      )}
      <div className="preview-actions">
        <Link to={`/properties/${p.id}`}>
          View property
          <ArrowUpRight size={14} />
        </Link>
        <a href={whatsapp(p)} target="_blank" rel="noreferrer">
          <MessageCircle size={14} />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
export default function PropertyMap({
  initialCity = "",
  initialId = "",
}: {
  initialCity?: string;
  initialId?: string;
}) {
  const [filters, setFilters] = useState({
    ...defaultFilters,
    purpose: properties.find((p) => p.id === initialId)?.purpose || defaultFilters.purpose,
    city: initialCity,
  });
  const [selected, setSelected] = useState(initialId);
  const [mobileView, setMobileView] = useState("List");
  const [error, setError] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const provider = useRef<MapProvider | null>(null);
  const results = filterProperties(properties, filters);
  const selectedProperty = results.find((p) => p.id === selected);
  const signature = results.map((p) => p.id).join(",");
  useEffect(() => {
    if (!container.current) return;
    try {
      provider.current = createMapProvider(container.current, () =>
        setError(true),
      );
    } catch {
      setError(true);
    }
    return () => provider.current?.destroy();
  }, []);
  useEffect(() => {
    provider.current?.setProperties(results, setSelected);
    provider.current?.select(selected);
    if (!results.some((p) => p.id === selected)) setSelected("");
  }, [signature]);
  useEffect(() => {
    provider.current?.select(selected);
    if (selected) {
      const el = document.getElementById(`map-result-${selected}`);
      const parent = el?.parentElement;
      if (el && parent)
        parent.scrollTo({
          top: el.offsetTop - parent.offsetTop - 45,
          behavior: "smooth",
        });
    }
    if (mobileView === "Map" && window.matchMedia("(max-width: 680px)").matches) {
      requestAnimationFrame(() => container.current?.parentElement?.scrollIntoView({block:"start",behavior:"smooth"}));
    }
  }, [selected, mobileView]);
  return (
    <div className="map-explorer">
      <div className="map-filter-top">
        <div className="segmented">
          {["Buy", "Rent", "Commercial"].map((x) => (
            <button
              key={x}
              aria-pressed={filters.purpose === x}
              className={filters.purpose === x ? "active" : ""}
              onClick={() => setFilters({ ...filters, purpose: x, budget: "" })}
            >
              {x}
            </button>
          ))}
        </div>
        <span>Approximate locations · illustrative inventory</span>
      </div>
      <div className="map-filters">
        <FilterFields compact filters={filters} onChange={setFilters} />
      </div>
      <div className="mobile-map-toggle">
        {["List", "Map"].map((v) => (
          <button
            key={v}
            onClick={() => setMobileView(v)}
            className={mobileView === v ? "active" : ""}
            aria-pressed={mobileView === v}
          >
            {v === "Map" && <MapPin size={15} />} {v}
          </button>
        ))}
      </div>
      <div className={`map-body mobile-${mobileView.toLowerCase()}`}>
        <div className="map-results">
          <div className="results-count">
            {results.length} properties in {filters.city || "Delhi NCR"}
          </div>
          {results.length ? (
            results.map((p) => (
              <button
                id={`map-result-${p.id}`}
                key={p.id}
                className={`map-listing ${selected === p.id ? "selected" : ""}`}
                onClick={() => {
                  setSelected(p.id);
                  setMobileView("Map");
                }}
              >
                <img
                  loading="lazy"
                  src={`/images/${p.image}.webp`}
                  alt="Representative property"
                  width="112"
                  height="100"
                />
                <span>
                  <b>{p.name}</b>
                  <small>
                    {p.locality}, {p.city}
                  </small>
                  <strong>{money(p.price, p.purpose === "Rent")}</strong>
                  <small>
                    {configuration(p)} · {p.area.toLocaleString("en-IN")} sq.ft.
                  </small>
                </span>
                <ArrowUpRight size={15} />
              </button>
            ))
          ) : (
            <div className="empty">
              <h3>No exact matches yet.</h3>
              <p>Try a wider budget or another location.</p>
              <button
                className="text-button"
                onClick={() => setFilters(defaultFilters)}
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
        <div className="map-canvas-wrap">
          <div
            className="map-canvas"
            ref={container}
            role="region"
            aria-label="Interactive property map"
          />
          {error && (
            <p className="map-warning">
              Map tiles may be unavailable. You can still select properties from
              the list.
            </p>
          )}
          {selectedProperty && (
            <PropertyPreview
              property={selectedProperty}
              onClose={() => setSelected("")}
            />
          )}
          <div className="map-caption">
            Delhi NCR <span>Explore a neighbourhood. Then a home.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
