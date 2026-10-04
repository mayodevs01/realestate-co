import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  MapPin,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { properties, locations } from "../data/properties";
import PropertySearch from "../components/PropertySearch";
import PropertyCard from "../components/PropertyCard";
import LazyMap from "../components/LazyMap";
import { RequirementForm } from "../components/Forms";
import {
  LocationCard,
  ProjectCard,
  InvestmentTable,
  WhyUs,
} from "../components/Discovery";
import { FinalCTA } from "../components/Layout";
import { whatsapp } from "../lib/property";
import type { Property } from "../types/property";
export default function Home({
  onVisit,
  onEnquire,
}: {
  onVisit: (p: Property) => void;
  onEnquire: () => void;
}) {
  const [tab, setTab] = useState("Featured");
  const featured = properties
    .filter((p) =>
      tab === "Featured"
        ? p.featured
        : tab === "Rental"
          ? p.purpose === "Rent"
          : tab === "Commercial"
            ? ["Office", "Retail"].includes(p.type)
            : tab === "New Projects"
              ? p.project
              : p.possession === "Ready to Move" && p.purpose === "Buy",
    )
    .slice(0, 3);
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow hero-eyebrow">
              <span />
              DELHI NCR PROPERTY ADVISORY
            </span>
            <h1>
              Search verified
              <br />
              properties across
              <br />
              <span>Delhi NCR.</span>
            </h1>
            <p className="hero-description">
              Without the property portal chaos.
              <br />
              <span>
                Residential, commercial and investment properties across Noida,
                Greater Noida, Gurugram and Ghaziabad.
              </span>
            </p>
            <PropertySearch />
            <a
              className="hero-whatsapp"
              href={whatsapp()}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={18} />
              WhatsApp an advisor
              <ArrowUpRight size={16} />
            </a>
            <div className="hero-trust">
              <span>
                <ShieldCheck size={15} />
                Verified listings*
              </span>
              <span>
                <Check size={15} />
                Direct site visits
              </span>
              <span>
                <Check size={15} />
                Local market assistance
              </span>
            </div>
          </div>
          <div className="hero-art">
            <div className="architectural-lines" aria-hidden="true" />
            <div className="art-caption">
              <span>BUILT AROUND YOUR NEXT MOVE.</span>
              <span>28.4595° N · 77.0266° E</span>
            </div>
            <img
              className="tower"
              src="/images/tower.webp"
              alt="Architectural rendering of a contemporary blue-glass tower"
              width="730"
              height="1100"
              fetchPriority="high"
            />
            <Link
              to="/properties/aravalli-residences-gurugram"
              className="hero-property"
            >
              <span className="eyebrow">A CLOSER LOOK</span>
              <h3>Aravalli Residences</h3>
              <p>Sector 79, Gurugram</p>
              <div>
                <span>3 BHK · 1,902 sq.ft.</span>
                <strong>₹2.15 Cr</strong>
              </div>
              <span className="text-link">
                View property
                <ArrowUpRight size={16} />
              </span>
            </Link>
            <Link to="/map" className="hero-map">
              <div className="mini-map" aria-hidden="true">
                <MapPin size={24} />
              </div>
              <div>
                <b>A location makes a difference.</b>
                <span>Explore Delhi NCR on the map</span>
                <small>Noida · Gurugram · Ghaziabad</small>
              </div>
              <ArrowUpRight size={21} />
            </Link>
          </div>
        </div>
        <div className="container hero-bottom">
          <span>YOUR SEARCH. A LITTLE MORE FOCUSED.</span>
          <span>
            *Demonstration inventory · Availability subject to advisor
            confirmation
          </span>
        </div>
      </section>
      <section className="section container" id="featured">
        <div className="section-heading">
          <div>
            <span className="eyebrow">START WITH A SHORTLIST</span>
            <h2>Properties worth a closer look.</h2>
          </div>
          <Link className="text-link" to="/properties">
            View all properties
            <ArrowUpRight size={18} />
          </Link>
        </div>
        <div
          className="inventory-tabs"
          role="group"
          aria-label="Featured property categories"
        >
          {[
            "Featured",
            "Ready to Move",
            "New Projects",
            "Rental",
            "Commercial",
          ].map((x) => (
            <button
              key={x}
              className={tab === x ? "active" : ""}
              aria-pressed={tab === x}
              onClick={() => setTab(x)}
            >
              {x}
            </button>
          ))}
        </div>
        <div className="property-grid">
          {featured.map((p) => (
            <PropertyCard key={p.id} property={p} onVisit={onVisit} />
          ))}
        </div>
      </section>
      <section className="map-section section" id="map">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">SEE THE BIGGER PICTURE</span>
              <h2>Explore properties on the map.</h2>
            </div>
            <p>
              Your commute. Your neighbourhood.
              <br />
              Find a location that works for you.
            </p>
          </div>
          <LazyMap />
          <p className="small-text muted map-disclaimer">
            Rental and yield figures are indicative estimates. Markers show
            approximate locality positions, not verified property entrances.
          </p>
        </div>
      </section>
      <section className="section container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">LOCAL KNOWLEDGE. A CLEARER SEARCH.</span>
            <h2>Where are you looking?</h2>
          </div>
          <Link to="/locations" className="text-link">
            Explore all locations
            <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="location-grid">
          {locations.map((l, i) => (
            <LocationCard key={l.name} location={l} index={i} />
          ))}
        </div>
      </section>
      <section className="section projects-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">PLAN YOUR NEXT MOVE</span>
              <h2>New & upcoming projects.</h2>
            </div>
            <Link to="/projects" className="text-link">
              View all projects
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="project-grid">
            {properties
              .filter((p) => p.project)
              .map((p) => (
                <ProjectCard key={p.id} property={p} />
              ))}
          </div>
          <p className="small-text muted">
            *Illustrative projects and starting prices. Registration, taxes and
            other charges may apply. RERA status must be verified.
          </p>
        </div>
      </section>
      <section className="requirement-section" id="requirement">
        <div className="container requirement-grid">
          <div>
            <span className="eyebrow">LET’S MAKE THIS EASIER</span>
            <h2>
              Tell us what
              <br />
              you’re looking for.
            </h2>
            <p>
              You don’t need to browse hundreds of listings. Share your
              requirement and we’ll shortlist relevant properties.
            </p>
            <div className="requirement-steps">
              <span>
                <b>01</b>Share your location and budget
              </span>
              <span>
                <b>02</b>Review a relevant shortlist
              </span>
              <span>
                <b>03</b>Visit the properties that fit
              </span>
            </div>
            <span className="signature">
              A better search starts with a conversation.
              <ArrowRight size={18} />
            </span>
          </div>
          <RequirementForm />
        </div>
      </section>
      <section className="section container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">LOOK BEYOND THE ASKING PRICE</span>
            <h2>
              Looking at property
              <br />
              as an investment?
            </h2>
          </div>
          <div>
            <p>
              Compare the numbers.
              <br />
              Then understand the neighbourhood.
            </p>
            <Link className="text-link" to="/investments">
              Explore investment properties
              <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
        <InvestmentTable
          properties={properties.filter((p) => p.investment).slice(0, 3)}
        />
        <p className="small-text muted">
          Rental and yield figures shown are indicative market estimates and not
          guaranteed returns. Gross yields exclude vacancy, maintenance, taxes
          and purchase costs.
        </p>
      </section>
      <WhyUs />
      <section className="section stories-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">THE DIFFERENCE IS IN THE DETAILS</span>
              <h2>A little perspective.</h2>
            </div>
            <span className="small-text muted">
              Illustrative customer stories · not verified reviews
            </span>
          </div>
          <div className="testimonials">
            <blockquote>
              <span className="quote-mark">“</span>
              <p>
                We had shortlisted several projects around Sector 150. The team
                helped us narrow them down before arranging visits, which saved
                us a lot of time.
              </p>
              <cite>
                Amit S.<small>Illustrative buyer · Noida</small>
              </cite>
            </blockquote>
            <blockquote>
              <span className="quote-mark">“</span>
              <p>
                What helped most was comparing the rent, maintenance and commute
                together. We went into the visits with a much clearer idea of
                what would work.
              </p>
              <cite>
                Priya M.<small>Illustrative tenant · Gurugram</small>
              </cite>
            </blockquote>
          </div>
        </div>
      </section>
      <FinalCTA onEnquire={onEnquire} />
    </>
  );
}
