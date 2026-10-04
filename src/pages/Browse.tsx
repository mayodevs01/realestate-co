import { useSearchParams, useParams, Link } from "react-router-dom";
import { ArrowUpRight, MapPin } from "lucide-react";
import { properties, locations, slugify, cities } from "../data/properties";
import { defaultFilters, filterProperties } from "../lib/property";
import { FilterFields } from "../components/PropertySearch";
import PropertyCard from "../components/PropertyCard";
import {
  LocationCard,
  ProjectCard,
  InvestmentTable,
  WhyUs,
} from "../components/Discovery";
import { RequirementForm } from "../components/Forms";
import LazyMap from "../components/LazyMap";
import { phone, email, phoneLabel, whatsapp } from "../lib/property";
import type { Property } from "../types/property";
export function Browse({ onVisit }: { onVisit: (p: Property) => void }) {
  const [query, setQuery] = useSearchParams();
  const f = {
    ...defaultFilters,
    ...Object.fromEntries(query),
    ready: query.get("ready") === "true",
  };
  let results = filterProperties(properties, f);
  const sort = query.get("sort") || "recommended";
  if (sort !== "recommended")
    results = [...results].sort((a, b) =>
      sort === "low" ? a.price - b.price : b.price - a.price,
    );
  return (
    <div className="container browse-page">
      <div className="page-heading">
        <span className="eyebrow">LESS BROWSING. MORE RELEVANT OPTIONS.</span>
        <h1>
          {f.purpose === "Rent"
            ? "Find your next rental."
            : f.purpose === "Commercial"
              ? "Space for your business."
              : "A property that fits your plans."}
        </h1>
        <p>
          Explore illustrative listings across Delhi NCR. Shortlist by location,
          budget and the way you want to live.
        </p>
      </div>
      <div className="browse-filters">
        <div className="segmented">
          {["Buy", "Rent", "Commercial"].map((t) => (
            <button
              key={t}
              className={f.purpose === t ? "active" : ""}
              aria-pressed={f.purpose === t}
              onClick={() =>
                setQuery({
                  ...Object.fromEntries(query),
                  purpose: t,
                  budget: "",
                })
              }
            >
              {t}
            </button>
          ))}
        </div>
        <div className="map-filters">
          <FilterFields
            filters={f}
            compact
            onChange={(next) =>
              setQuery(
                Object.fromEntries(
                  Object.entries(next).map(([k, v]) => [k, String(v)]),
                ),
              )
            }
          />
        </div>
      </div>
      <div className="browse-toolbar">
        <span aria-live="polite">
          {results.length} {results.length === 1 ? "property" : "properties"}{" "}
          found
        </span>
        <div>
          <label className="sort-label">
            Sort by
            <select
              value={sort}
              onChange={(e) =>
                setQuery({ ...Object.fromEntries(query), sort: e.target.value })
              }
            >
              <option value="recommended">Recommended</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
            </select>
          </label>
          <Link
            className="text-link"
            to={`/map?city=${encodeURIComponent(f.city)}`}
          >
            <MapPin size={16} />
            Map view
          </Link>
        </div>
      </div>
      {results.length ? (
        <div className="property-grid">
          {results.map((p) => (
            <PropertyCard key={p.id} property={p} onVisit={onVisit} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>No exact matches in this shortlist.</h2>
          <p>Try another location or share your requirement with an advisor.</p>
          <button className="button" onClick={() => setQuery({})}>
            Reset filters
          </button>
          <Link className="text-link" to="/contact">
            Share requirement
            <ArrowUpRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
export function MapPage() {
  const [q] = useSearchParams();
  return (
    <div className="container map-page">
      <div className="page-heading">
        <span className="eyebrow">PUT YOUR SEARCH IN CONTEXT</span>
        <h1>Explore Delhi NCR on the map.</h1>
        <p>
          Compare properties and neighbourhoods together. Select a marker or a
          listing to see more.
        </p>
      </div>
      <LazyMap initialCity={q.get("city") || ""} />
    </div>
  );
}
export function Locations({ onVisit }: { onVisit: (p: Property) => void }) {
  const { city, locality } = useParams();
  if (!city)
    return (
      <div className="container section">
        <div className="page-heading">
          <span className="eyebrow">FIND YOUR PART OF DELHI NCR</span>
          <h1>Where are you looking?</h1>
          <p>
            Start with your everyday life: the commute, schools and the space
            you need.
          </p>
        </div>
        <div className="location-grid">
          {locations.map((l, i) => (
            <LocationCard key={l.name} location={l} index={i} />
          ))}
        </div>
      </div>
    );
  const cityName = cities.find((c) => slugify(c) === city);
  const location = locations.find((l) => slugify(l.name) === city);
  const area = locality
    ? location?.areas.find((a) => slugify(a) === locality)
    : undefined;
  if (!cityName || (locality && !area)) return <NotFound />;
  const results = properties.filter(
    (p) =>
      (p.city === cityName || p.city === area) &&
      (!area || p.locality === area || p.city === area),
  );
  return (
    <div className="container section">
      <nav className="breadcrumbs">
        <Link to="/locations">Locations</Link>
        <span>/</span>
        <Link to={`/locations/${city}`}>{cityName}</Link>
        {area && (
          <>
            <span>/</span>
            <span>{area}</span>
          </>
        )}
      </nav>
      <div className="page-heading">
        <span className="eyebrow">LOCAL FOCUS. RELEVANT CHOICES.</span>
        <h1>Property in {area || cityName}.</h1>
        <p>
          {location?.summary ||
            "Explore properties in an established Delhi NCR neighbourhood."}{" "}
          Compare your daily travel, total budget and possession requirements
          before shortlisting.
        </p>
      </div>
      {location && !area && (
        <div className="locality-links">
          {location.areas.map((a) => (
            <Link key={a} to={`/locations/${city}/${slugify(a)}`}>
              {a}
              <ArrowUpRight size={15} />
            </Link>
          ))}
        </div>
      )}
      <div className="section-heading">
        <h2>
          {results.length
            ? `Explore ${area || cityName}.`
            : "Let’s find options in this neighbourhood."}
        </h2>
        <Link className="text-link" to="/contact">
          Ask a local advisor
          <ArrowUpRight size={16} />
        </Link>
      </div>
      {results.length ? (
        <div className="property-grid">
          {results.map((p) => (
            <PropertyCard key={p.id} property={p} onVisit={onVisit} />
          ))}
        </div>
      ) : (
        <p>
          There are no matching demo listings here yet. Share your requirement
          and an advisor can discuss relevant options.
        </p>
      )}
      <div className="locality-guide">
        <h2>Before choosing {area || cityName}.</h2>
        <div className="trust-grid">
          <div>
            <h3>Check your commute</h3>
            <p>
              Visit at your usual travel time. Compare road access, public
              transport and the final approach to the property.
            </p>
          </div>
          <div>
            <h3>Compare the full cost</h3>
            <p>
              Include maintenance, parking, transfer charges and fit-out costs
              alongside the asking price.
            </p>
          </div>
          <div>
            <h3>Look at possession</h3>
            <p>
              For ready homes, check condition and occupancy documents. For new
              projects, verify milestones and RERA records.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export function Projects() {
  return (
    <div className="container section">
      <div className="page-heading">
        <span className="eyebrow">COMPARE BEFORE YOU COMMIT</span>
        <h1>New & upcoming projects.</h1>
        <p>
          Illustrative project options. Starting prices, configurations and
          possession dates require verification.
        </p>
      </div>
      <div className="project-grid">
        {properties
          .filter((p) => p.project)
          .map((p) => (
            <ProjectCard key={p.id} property={p} />
          ))}
      </div>
    </div>
  );
}
export function Investments({ onVisit }: { onVisit: (p: Property) => void }) {
  const items = properties.filter((p) => p.investment);
  return (
    <div className="container section">
      <div className="page-heading">
        <span className="eyebrow">UNDERSTAND THE NUMBERS</span>
        <h1>Property, with an investment lens.</h1>
        <p>
          Compare purchase prices and indicative rental potential. Consider
          vacancy, expenses, financing and resale liquidity before deciding.
        </p>
      </div>
      <InvestmentTable properties={items} />
      <p className="estimate-note">
        Rental and yield figures shown are indicative market estimates and not
        guaranteed returns. Gross yields exclude vacancy, maintenance, taxes and
        acquisition costs. This demo is not investment advice.
      </p>
      <div className="property-grid">
        {items.map((p) => (
          <PropertyCard key={p.id} property={p} onVisit={onVisit} />
        ))}
      </div>
    </div>
  );
}
export function About() {
  return (
    <>
      <div className="container page-heading about-heading">
        <span className="eyebrow">REALESTATE.CO · DELHI NCR</span>
        <h1>
          A focused approach
          <br />
          to finding property.
        </h1>
        <p>
          RealEstate.co is a fictional independent property advisory built
          around a simple process: understand the requirement, shortlist
          relevant options, and help buyers and tenants ask the right questions.
        </p>
        <p>
          Our demonstration covers residential sales and rentals, new projects,
          resale homes, offices, retail spaces and plots across Delhi NCR.
        </p>
      </div>
      <WhyUs />
    </>
  );
}
export function Contact() {
  return (
    <section className="container section requirement-grid">
      <div className="page-heading">
        <span className="eyebrow">LET’S TALK PROPERTY</span>
        <h1>
          Tell us what
          <br />
          you’re looking for.
        </h1>
        <p>
          Share your preferred location, budget and timeline. We’ll start with
          the options that fit.
        </p>
        <div className="contact-details">
          <a href={`tel:+${phone}`}>{phoneLabel}</a>
          <a href={whatsapp()} target="_blank" rel="noreferrer">
            WhatsApp an advisor
            <ArrowUpRight size={16} />
          </a>
          <a href={`mailto:${email}`}>{email}</a>
          <p>
            Monday–Saturday · 10 am–7 pm IST
            <br />
            Delhi NCR · site visits by appointment
          </p>
        </div>
      </div>
      <RequirementForm />
    </section>
  );
}
export function Legal({ type }: { type: "privacy" | "terms" }) {
  return (
    <article className="container legal section">
      <span className="eyebrow">REALESTATE.CO</span>
      <h1>{type === "privacy" ? "Privacy policy." : "Terms & disclosures."}</h1>
      <p>Last updated: 4 October 2026</p>
      {type === "privacy" ? (
        <>
          <h2>Information you choose to share</h2>
          <p>
            Enquiry forms collect your name, phone number, property preferences
            and, for visit requests, your preferred date and time. Email is not
            required. Please do not submit identification documents or financial
            account details.
          </p>
          <h2>How the information is used</h2>
          <p>
            Your details are used to respond to your specific property or
            site-visit request. Requests are stored in a private Cloudflare D1
            database accessible to the site operator. We do not sell your
            enquiry details or enrol you in a marketing list.
          </p>
          <h2>Retention and your choices</h2>
          <p>
            Requests are retained for up to 90 days unless continued
            communication requires a longer period. The operator is responsible
            for regular deletion. You can request access, correction or
            deletion, or withdraw contact consent by emailing {email}.
          </p>
          <h2>External services</h2>
          <p>
            Opening WhatsApp shares your prefilled message only when you send it
            there. Calling or emailing uses your device’s chosen app. The map
            loads tiles from OpenStreetMap, which receives standard connection
            information such as your IP address. Hosting is provided by
            Cloudflare. We do not use advertising cookies or analytics trackers.
          </p>
          <h2>Questions</h2>
          <p>
            Contact <a href={`mailto:${email}`}>{email}</a> for privacy
            requests.
          </p>
        </>
      ) : (
        <>
          <h2>A fictional demonstration</h2>
          <p>
            RealEstate.co is a fictional brokerage website. All property
            inventory is illustrative; photographs represent property categories
            and do not verify the appearance of any named listing. ATS Pristine
            is included as an example, without claiming affiliation,
            authorisation or current inventory.
          </p>
          <h2>Prices and availability</h2>
          <p>
            Figures are sample asking prices, not offers or valuations.
            Availability, areas, title, floor plans, maintenance, possession and
            taxes must be verified independently. No booking, payment or
            reservation is accepted through this site.
          </p>
          <h2>Investment estimates</h2>
          <p>
            Rental figures, travel times and gross yields are indicative.
            Returns are not guaranteed. Consult qualified advisers and assess
            vacancy, expenses and market risks before investing.
          </p>
          <h2>RERA and documents</h2>
          <p>
            No agent or project RERA registration is claimed. Obtain and verify
            applicable project and agent registrations, sanctioned plans,
            occupancy/completion certificates, title documents and approvals
            before a transaction.
          </p>
          <h2>Site visit requests</h2>
          <p>
            Submitting a request does not confirm a viewing. An advisor must
            confirm the property, date and time with you. Illustrative customer
            stories are not verified testimonials.
          </p>
          <h2>Contact</h2>
          <p>
            <a href={`mailto:${email}`}>{email}</a> · {phoneLabel}
          </p>
        </>
      )}
    </article>
  );
}
export function NotFound() {
  return (
    <div className="container empty">
      <span className="eyebrow">404 · PAGE NOT FOUND</span>
      <h1>Let’s get your search back on track.</h1>
      <Link className="button" to="/properties">
        Explore properties
        <ArrowUpRight size={18} />
      </Link>
    </div>
  );
}
