import maplibregl from "maplibre-gl";
import type { Property } from "../types/property";
import { money } from "./property";
export interface MapProvider {
  setProperties: (properties: Property[], select: (id: string) => void) => void;
  select: (id: string) => void;
  destroy: () => void;
}
export function createMapProvider(
  container: HTMLElement,
  onError: () => void,
): MapProvider {
  const map = new maplibregl.Map({
    container,
    center: [77.24, 28.54],
    zoom: 9,
    attributionControl: { compact: true },
    style: {
      version: 8,
      sources: {
        osm: {
          type: "raster",
          tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
          tileSize: 256,
          maxzoom: 19,
          attribution:
            '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
        },
      },
      layers: [
        {
          id: "osm",
          type: "raster",
          source: "osm",
          paint: { "raster-saturation": -0.75, "raster-contrast": -0.12 },
        },
      ],
    },
  });
  map.addControl(
    new maplibregl.NavigationControl({ showCompass: false }),
    "top-right",
  );
  map.on("error", onError);
  let markers: {
    p: Property;
    marker: maplibregl.Marker;
    el: HTMLButtonElement;
  }[] = [];
  const resize = new ResizeObserver(() => map.resize());
  resize.observe(container);
  return {
    setProperties(properties, select) {
      markers.forEach((m) => m.marker.remove());
      markers = properties.map((p) => {
        const el = document.createElement("button");
        el.className = "price-marker";
        el.type = "button";
        el.textContent = money(p.price);
        el.setAttribute(
          "aria-label",
          `${p.name}, ${money(p.price)}. Show property`,
        );
        el.addEventListener("click", () => select(p.id));
        const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
          .setLngLat(p.coordinates)
          .addTo(map);
        return { p, marker, el };
      });
      if (properties.length) {
        const bounds = new maplibregl.LngLatBounds();
        properties.forEach((p) => bounds.extend(p.coordinates));
        map.fitBounds(bounds, { padding: 70, maxZoom: 12, duration: 500 });
      }
    },
    select(id) {
      markers.forEach(({ p, el }) => {
        el.classList.toggle("selected", p.id === id);
        el.setAttribute("aria-pressed", String(p.id === id));
      });
      const found = markers.find((m) => m.p.id === id);
      if (found) map.easeTo({ center: found.p.coordinates, duration: 500 });
    },
    destroy() {
      resize.disconnect();
      map.remove();
    },
  };
}
