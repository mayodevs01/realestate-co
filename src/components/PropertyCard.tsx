import { ArrowUpRight, BedDouble, Maximize2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { Property } from "../types/property";
import { configuration, money } from "../lib/property";
export default function PropertyCard({
  property: p,
  onVisit,
}: {
  property: Property;
  onVisit: (p: Property) => void;
}) {
  return (
    <article className="property-card">
      <Link to={`/properties/${p.id}`} className="property-photo">
        <img
          src={`/images/${p.image}.webp`}
          alt={`Illustrative ${p.type.toLowerCase()} for ${p.name}`}
          loading="lazy"
          width="800"
          height="560"
        />
        <span className="image-label">
          {p.purpose === "Rent"
            ? "FOR RENT"
            : p.possession === "Ready to Move"
              ? "READY TO MOVE"
              : "NEW PROJECT"}
        </span>
        <span className="photo-note">Representative image</span>
        <span className="image-arrow">
          <ArrowUpRight size={20} />
        </span>
      </Link>
      <div className="property-body">
        <div className="property-heading">
          <h3>
            <Link to={`/properties/${p.id}`}>{p.name}</Link>
          </h3>
          <strong>{money(p.price, p.purpose === "Rent")}</strong>
        </div>
        <p className="muted">
          {p.locality}, {p.city}
        </p>
        <div className="spec-line">
          <span>
            <BedDouble size={15} />
            {configuration(p)}
          </span>
          <span>
            <Maximize2 size={14} />
            {p.area.toLocaleString("en-IN")} sq.ft.
          </span>
          <span>{p.type}</span>
        </div>
        <div className="card-actions">
          <Link to={`/properties/${p.id}`}>
            View property <ArrowUpRight size={15} />
          </Link>
          <button onClick={() => onVisit(p)}>Schedule visit</button>
        </div>
      </div>
    </article>
  );
}
