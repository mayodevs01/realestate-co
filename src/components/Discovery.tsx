import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { locations, slugify } from "../data/properties";
import { configuration, money, yieldRange } from "../lib/property";
import type { Property } from "../types/property";
export function LocationCard({
  location: l,
  index,
}: {
  location: (typeof locations)[number];
  index: number;
}) {
  return (
    <article className={`location-block location-${index}`}>
      <img
        src={`/images/${l.image}.webp`}
        loading="lazy"
        alt={`Representative architecture for ${l.name}`}
        width="800"
        height="600"
      />
      <div className="location-content">
        <span className="location-index">0{index + 1} / DELHI NCR</span>
        <h3>
          <Link to={`/locations/${slugify(l.name)}`}>
            {l.name}
            <ArrowUpRight />
          </Link>
        </h3>
        <p>{l.summary}</p>
        <div>
          {l.areas.map((a) => (
            <Link key={a} to={`/locations/${slugify(l.name)}/${slugify(a)}`}>
              {a}
              <ArrowUpRight size={12} />
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
export function ProjectCard({ property: p }: { property: Property }) {
  return (
    <article className="project-card">
      <Link to={`/properties/${p.id}`}>
        <img
          src={`/images/${p.image}.webp`}
          alt={`${p.name} representative architecture`}
          loading="lazy"
          width="800"
          height="550"
        />
      </Link>
      <div>
        <span className="eyebrow">{p.developer}</span>
        <h3>
          <Link to={`/properties/${p.id}`}>{p.name}</Link>
        </h3>
        <p>
          {p.locality}, {p.city} · {p.bhk} & {p.bhk + 1} BHK
        </p>
        <strong>
          {money(p.price)} <small>onwards*</small>
        </strong>
        <div className="project-meta">
          <span>{p.possession}</span>
          <span>RERA: verification required</span>
        </div>
        <Link className="text-link" to={`/properties/${p.id}`}>
          View project
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  );
}
export function InvestmentTable({
  properties: items,
}: {
  properties: Property[];
}) {
  return (
    <div
      className="table-scroll"
      tabIndex={0}
      aria-label="Investment property comparison"
    >
      <table>
        <thead>
          <tr>
            <th>Property / location</th>
            <th>Purchase price</th>
            <th>Est. monthly rent</th>
            <th>Approx. gross yield</th>
            <th>Type / possession</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id}>
              <td>
                <Link to={`/properties/${p.id}`}>
                  {p.name}
                  <ArrowUpRight size={14} />
                </Link>
                <small>
                  {p.locality}, {p.city}
                </small>
              </td>
              <td>{money(p.price)}</td>
              <td>
                {money(p.rent[0])}–{money(p.rent[1])}
              </td>
              <td>{yieldRange(p)}</td>
              <td>
                {configuration(p)} · {p.type}
                <small>{p.possession}</small>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export function WhyUs() {
  return (
    <section className="section container why-section" id="why">
      <div className="section-heading">
        <div>
          <span className="eyebrow">LESS UNCERTAINTY. BETTER DECISIONS.</span>
          <h2>
            Property decisions should
            <br />
            start with clarity.
          </h2>
        </div>
        <p>
          The right property is only part of it.
          <br />
          You should understand what comes with it.
        </p>
      </div>
      <div className="trust-grid">
        {[
          [
            "Verified Availability",
            "We reconfirm listing availability before arranging a visit.",
          ],
          [
            "Local Market Knowledge",
            "Our focus is Delhi NCR micro-markets rather than every city in India.",
          ],
          [
            "Site Visit Coordination",
            "Shortlist properties and arrange visits around the buyer’s schedule.",
          ],
          [
            "Buyer Assistance",
            "Understand pricing, maintenance, payment plans and possession before making a decision.",
          ],
        ].map(([h, p], i) => (
          <div key={h}>
            <span>0{i + 1}</span>
            <h3>{h}</h3>
            <p>{p}</p>
          </div>
        ))}
      </div>
      <p className="small-text muted">
        This fictional brokerage demonstrates the service process. Demo listings
        have not been independently verified.
      </p>
    </section>
  );
}
