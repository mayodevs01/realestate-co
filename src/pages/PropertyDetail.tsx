import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowUpRight,
  BedDouble,
  Maximize2,
  Check,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  TrainFront,
  Car,
  Hospital,
  GraduationCap,
} from "lucide-react";
import { properties } from "../data/properties";
import {
  money,
  configuration,
  phone,
  phoneLabel,
  whatsapp,
  yieldRange,
} from "../lib/property";
import PropertyCard from "../components/PropertyCard";
import LazyMap from "../components/LazyMap";
import type { Property } from "../types/property";
export default function PropertyDetail({
  onVisit,
  onFloorplan,
}: {
  onVisit: (p: Property) => void;
  onFloorplan: (p: Property) => void;
}) {
  const { id } = useParams();
  const p = properties.find((p) => p.id === id);
  const [image, setImage] = useState("");
  if (!p)
    return (
      <div className="container empty">
        <h1>Property not found.</h1>
        <Link className="button" to="/properties">
          Browse available listings
        </Link>
      </div>
    );
  const photos = [
    p.image,
    p.type === "Office" ? "office" : "interior",
    p.type === "Plot" ? "land" : "living",
  ];
  return (
    <>
      <div className="container detail-page">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/properties">Properties</Link>
          <span>/</span>
          <span>{p.name}</span>
        </nav>
        <div className="detail-top">
          <div className="gallery">
            <div className="gallery-main">
              <img
                src={`/images/${image || p.image}.webp`}
                alt={`${p.name} — representative ${image === "interior" ? "interior" : "property"} image`}
                width="1100"
                height="760"
              />
              <span className="image-label">{p.possession}</span>
              <span className="photo-note">
                Illustrative photography · not actual property
              </span>
            </div>
            <div className="gallery-thumbs">
              {photos.map((photo, i) => (
                <button
                  key={i}
                  aria-label={`View representative photo ${i + 1}`}
                  aria-pressed={(image || p.image) === photo}
                  onClick={() => setImage(photo)}
                >
                  <img
                    src={`/images/${photo}.webp`}
                    alt={`Representative view ${i + 1}`}
                    width="180"
                    height="110"
                  />
                </button>
              ))}
              <div>
                See the space.
                <br />
                Then see it in person.
              </div>
            </div>
          </div>
          <div className="detail-summary">
            <span className="eyebrow">
              {p.type.toUpperCase()} · FOR{" "}
              {p.purpose === "Buy" ? "SALE" : "RENT"}
            </span>
            <h1>{p.name}</h1>
            <p className="detail-location">
              <MapPin size={16} />
              {p.locality}, {p.city}
            </p>
            <div className="detail-price">
              {money(p.price, p.purpose === "Rent")}
            </div>
            <p className="muted">
              {money(Math.round(p.price / p.area))} / sq.ft.
              {p.purpose === "Rent" ? " / month" : ""} · Indicative asking price
            </p>
            <div className="detail-specs">
              <span>
                <BedDouble />
                {configuration(p)}
              </span>
              <span>
                <Maximize2 />
                {p.area.toLocaleString("en-IN")} sq.ft.
              </span>
              <span>
                <Check />
                {p.possession}
              </span>
            </div>
            <button className="button" onClick={() => onVisit(p)}>
              Schedule site visit
              <ArrowUpRight size={18} />
            </button>
            <a
              className="button outline"
              href={whatsapp(p)}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={18} />
              WhatsApp advisor
            </a>
            <a className="detail-phone" href={`tel:+${phone}`}>
              <Phone size={15} />
              {phoneLabel}
            </a>
            <p className="small-text muted">
              <ShieldCheck size={14} />
              Demo listing. Ask an advisor to confirm availability.
            </p>
          </div>
        </div>
        <nav className="detail-nav" aria-label="Property sections">
          {[
            "Overview",
            "Pricing",
            "Floor plans",
            "Amenities",
            "Property details",
            "Location",
            "RERA",
          ].map((n) => (
            <a key={n} href={`#${n.toLowerCase().replaceAll(" ", "-")}`}>
              {n}
            </a>
          ))}
        </nav>
        <div className="detail-content">
          <div>
            <section id="overview">
              <span className="eyebrow">A CLOSER LOOK</span>
              <h2>About this property.</h2>
              <p>{p.description}</p>
            </section>
            <section id="pricing">
              <h2>Pricing, with context.</h2>
              <dl className="details-grid">
                <div>
                  <dt>
                    Asking {p.purpose === "Rent" ? "monthly rent" : "price"}
                  </dt>
                  <dd>{money(p.price)}</dd>
                </div>
                <div>
                  <dt>Price per sq.ft.</dt>
                  <dd>{money(Math.round(p.price / p.area))}</dd>
                </div>
                <div>
                  <dt>Estimated monthly rent</dt>
                  <dd>
                    {p.rent[0]
                      ? `${money(p.rent[0])}–${money(p.rent[1])}`
                      : "Not estimated"}
                  </dd>
                </div>
                <div>
                  <dt>Approx. gross rental yield</dt>
                  <dd>{yieldRange(p)}</dd>
                </div>
              </dl>
              <p className="small-text muted">
                Indicative estimates only. Prices exclude stamp duty,
                registration, taxes and other applicable charges. Rental yield
                is gross annual estimated rent divided by asking price; it
                excludes vacancy and expenses. No return is guaranteed.
              </p>
            </section>
            <section id="floor-plans">
              <h2>Understand the layout.</h2>
              <div className="floorplan-request">
                <Maximize2 size={36} />
                <div>
                  <h3>
                    {configuration(p)} · {p.area.toLocaleString("en-IN")} sq.ft.
                  </h3>
                  <p>
                    A verified floor plan is not available for this demo
                    listing. Request the current layout and area breakdown from
                    an advisor.
                  </p>
                </div>
                <button className="text-link" onClick={() => onFloorplan(p)}>
                  Request floor plan
                  <ArrowUpRight size={17} />
                </button>
              </div>
            </section>
            <section id="amenities">
              <h2>Amenities to confirm.</h2>
              <p>
                These are typical features to discuss during a site visit;
                provision varies by property.
              </p>
              <div className="amenities">
                {(p.type === "Plot"
                  ? [
                      "Road access",
                      "Electricity provision",
                      "Water connection",
                      "Boundary demarcation",
                    ]
                  : p.type === "Office" || p.type === "Retail"
                    ? [
                        "Security & access",
                        "Power backup",
                        "Visitor parking",
                        "Lift access",
                        "Fire safety",
                        "Maintenance services",
                      ]
                    : [
                        "Gated access",
                        "Power backup",
                        "Lift access",
                        "Landscaped spaces",
                        "Visitor parking",
                        "Water supply",
                      ]
                ).map((a) => (
                  <span key={a}>
                    <Check size={16} />
                    {a}
                  </span>
                ))}
              </div>
            </section>
            <section id="property-details">
              <h2>The useful details.</h2>
              <dl className="details-grid">
                {Object.entries({
                  "Property type": p.type,
                  Configuration: configuration(p),
                  "Built-up / plot area": `${p.area.toLocaleString("en-IN")} sq.ft.`,
                  "Carpet area": p.carpet
                    ? `${p.carpet.toLocaleString("en-IN")} sq.ft. (illustrative)`
                    : "Not applicable",
                  Floor: p.floor,
                  "Total floors": p.floors,
                  Facing: p.facing,
                  Furnishing: p.furnishing,
                  Parking: p.parking,
                  "Property age": p.age,
                  Possession: p.possession,
                  Maintenance: p.maintenance,
                  Ownership: p.ownership,
                  Availability: "Advisor confirmation required",
                }).map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </section>
            <section id="connectivity">
              <h2>Nearby connectivity.</h2>
              <div className="connectivity">
                {[
                  [
                    TrainFront,
                    p.city === "Noida"
                      ? "Nearest metro connection"
                      : "Metro / transit connection",
                    "Approx. 8–20 min",
                  ],
                  [Car, "Main arterial road", "Approx. 5–15 min"],
                  [Hospital, "Neighbourhood hospital", "Approx. 10–20 min"],
                  [GraduationCap, "Nearby schools", "Approx. 10–20 min"],
                ].map(([Icon, label, time]) => {
                  const I = Icon as typeof Car;
                  return (
                    <div key={String(label)}>
                      <I size={22} />
                      <span>
                        {String(label)}
                        <small>{String(time)}</small>
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="small-text muted">
                Illustrative travel ranges, not measured routes. Actual times
                depend on the property entrance, traffic and chosen destination.
              </p>
            </section>
            <section id="rera">
              <h2>Developer & RERA.</h2>
              <p>
                <strong>{p.developer}</strong>
              </p>
              <p>
                No RERA number is asserted for this demo inventory. Obtain the
                current project and agent registration details, where
                applicable, and verify them on the relevant state regulator’s
                website before paying or booking.
              </p>
              <div className="inline-links">
                <a
                  href="https://www.up-rera.in/"
                  target="_blank"
                  rel="noreferrer"
                >
                  UP RERA
                  <ArrowUpRight size={14} />
                </a>
                <a
                  href="https://haryanarera.gov.in/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Haryana RERA
                  <ArrowUpRight size={14} />
                </a>
                <a
                  href="https://rera.delhi.gov.in/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Delhi RERA
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </section>
          </div>
          <aside className="detail-advisor">
            <span className="eyebrow">YOUR NEXT STEP</span>
            <h3>Does this property fit?</h3>
            <p>
              Ask about the current price, possession, maintenance and visit
              availability.
            </p>
            <button className="button" onClick={() => onVisit(p)}>
              Check availability
              <ArrowUpRight size={16} />
            </button>
            <a href={whatsapp(p)} target="_blank" rel="noreferrer">
              Ask about this property
              <ArrowUpRight size={15} />
            </a>
          </aside>
        </div>
        <section id="location" className="section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">THE NEIGHBOURHOOD MATTERS</span>
              <h2>
                {p.locality}, {p.city}.
              </h2>
            </div>
            <Link
              className="text-link"
              to={`/map?city=${encodeURIComponent(p.city)}`}
            >
              See nearby properties
              <ArrowUpRight size={16} />
            </Link>
          </div>
          <LazyMap initialCity={p.city} initialId={p.id} />
        </section>
        <section className="section">
          <div className="section-heading">
            <h2>Explore similar properties.</h2>
            <Link
              to={`/properties?city=${encodeURIComponent(p.city)}`}
              className="text-link"
            >
              See more
              <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="property-grid">
            {properties
              .filter((x) => x.id !== p.id && x.purpose === p.purpose)
              .sort(
                (a, b) => Number(b.city === p.city) - Number(a.city === p.city),
              )
              .slice(0, 3)
              .map((x) => (
                <PropertyCard key={x.id} property={x} onVisit={onVisit} />
              ))}
          </div>
        </section>
      </div>
    </>
  );
}
