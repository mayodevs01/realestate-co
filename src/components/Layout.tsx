import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarDays,
  Menu,
  MessageCircle,
  Phone,
  X,
} from "lucide-react";
import { phone, phoneLabel, email, whatsapp } from "../lib/property";
import { RequirementForm } from "./Forms";
import type { Property } from "../types/property";
export function Logo() {
  return (
    <Link className="logo" to="/" aria-label="RealEstate.co home">
      <svg viewBox="0 0 38 38" aria-hidden="true">
        <path
          d="M5 33V11L18 4v29M18 15l14-7v25M1 34h36M10 13v15M24 16v12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
      <span>
        RealEstate<span className="logo-co">.co</span>
        <small>DELHI NCR PROPERTY ADVISORY</small>
      </span>
    </Link>
  );
}
export function Navbar({ onEnquire }: { onEnquire: () => void }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setOpen(false), [location]);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="container nav-inner">
          <Logo />
          <nav
            className={open ? "nav-links open" : "nav-links"}
            aria-label="Main navigation"
          >
            <Link to="/properties?purpose=Buy">Buy</Link>
            <Link to="/properties?purpose=Rent">Rent</Link>
            <Link to="/properties?purpose=Commercial">Commercial</Link>
            <Link to="/projects">New projects</Link>
            <Link to="/locations">Locations</Link>
            <Link to="/about">About us</Link>
          </nav>
          <button className="button small nav-cta" onClick={onEnquire}>
            Speak to an advisor
            <ArrowUpRight size={16} />
          </button>
          <button
            className="menu-button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer>
      <div className="container footer-grid">
        <div>
          <Logo />
          <p>
            Clear advice. Relevant properties.
            <br />
            Local knowledge across Delhi NCR.
          </p>
          <a href={`tel:+${phone}`}>{phoneLabel}</a>
          <a href={`mailto:${email}`}>{email}</a>
          <p className="small-text">
            Monday–Saturday · 10 am–7 pm IST
            <br />
            Site visits by appointment.
          </p>
        </div>
        <div>
          <h3>Find a property</h3>
          <Link to="/properties?purpose=Buy">Buy a home</Link>
          <Link to="/properties?purpose=Rent">Rent a home</Link>
          <Link to="/properties?purpose=Commercial">Commercial</Link>
          <Link to="/projects">New projects</Link>
          <Link to="/investments">Investment properties</Link>
        </div>
        <div>
          <h3>Areas we cover</h3>
          {[
            "Noida",
            "Greater Noida",
            "Gurugram",
            "Ghaziabad",
            "Indirapuram",
            "Delhi",
          ].map((c) => (
            <Link
              key={c}
              to={`/locations/${c.toLowerCase().replaceAll(" ", "-")}`}
            >
              {c}
            </Link>
          ))}
        </div>
        <div>
          <h3>Let’s talk property</h3>
          <Link to="/contact">Share your requirement</Link>
          <a href={whatsapp()} target="_blank" rel="noreferrer">
            WhatsApp an advisor
            <ArrowUpRight size={14} />
          </a>
          <Link to="/about">About RealEstate.co</Link>
          <Link to="/privacy">Privacy policy</Link>
          <Link to="/terms">Terms & disclosures</Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} RealEstate.co</span>
        <p>
          Fictional brokerage demonstration. Listings, project names (except
          identified examples), photographs and customer stories are
          illustrative. Prices, rents and gross yields are indicative, exclude
          costs and are not guaranteed. No developer affiliation or RERA
          registration is claimed. Verify documents, availability and applicable
          RERA records independently before transacting.
        </p>
      </div>
    </footer>
  );
}
export function MobileContactBar({
  property,
  onVisit,
}: {
  property?: Property;
  onVisit: () => void;
}) {
  return (
    <>
      <a
        className="floating-whatsapp"
        href={whatsapp(property)}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp an advisor"
      >
        <MessageCircle size={19} />
        <span>Ask an advisor</span>
      </a>
      <div className="mobile-contact">
        <a href={`tel:+${phone}`}>
          <Phone size={17} />
          Call
        </a>
        <a href={whatsapp(property)} target="_blank" rel="noreferrer">
          <MessageCircle size={18} />
          WhatsApp
        </a>
        <button onClick={onVisit}>
          <CalendarDays size={17} />
          Site visit
        </button>
      </div>
    </>
  );
}
export function EnquiryModal({
  property,
  kind,
  onClose,
}: {
  property?: Property;
  kind: string;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const prior = document.activeElement as HTMLElement;
    const dialog = ref.current;
    dialog?.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
      dialog?.close();
      prior?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="enquiry-modal"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-labelledby="enquiry-title"
    >
      <button
        className="modal-close"
        onClick={onClose}
        aria-label="Close enquiry"
      >
        <X />
      </button>
      <span className="eyebrow">LET’S TAKE THE NEXT STEP</span>
      <h2 id="enquiry-title">
        {property
          ? kind === "floorplan"
            ? "Request a floor plan."
            : "See it for yourself."
          : "Tell us what you’re looking for."}
      </h2>
      <p>
        {property
          ? `${property.name} · ${property.locality}, ${property.city}`
          : "Share a few details. We’ll help you shortlist relevant options."}
      </p>
      {property && (
        <p className="small-text">
          Illustrative listing. An advisor must confirm availability and your
          appointment.
        </p>
      )}
      <RequirementForm property={property} kind={kind} onDone={onClose} />
    </dialog>
  );
}
export function FinalCTA({ onEnquire }: { onEnquire: () => void }) {
  return (
    <section className="final-cta">
      <div className="container">
        <div>
          <span className="eyebrow">
            A CONVERSATION IS A GOOD PLACE TO START
          </span>
          <h2>Still comparing properties?</h2>
          <p>
            Share your location and budget.
            <br />
            We’ll help you shortlist relevant options.
          </p>
        </div>
        <div>
          <button className="button light" onClick={onEnquire}>
            Share requirement
            <ArrowUpRight size={18} />
          </button>
          <a
            className="light-link"
            href={whatsapp()}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp an advisor
            <ArrowUpRight size={16} />
          </a>
          <a href={`tel:+${phone}`} className="cta-phone">
            {phoneLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
