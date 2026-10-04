import { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import {
  Navbar,
  Footer,
  MobileContactBar,
  EnquiryModal,
} from "./components/Layout";
import { properties, slugify, cities } from "./data/properties";
import type { Property } from "./types/property";
const PropertyDetail = lazy(() => import("./pages/PropertyDetail"));
const Browse = lazy(() =>
  import("./pages/Browse").then((m) => ({ default: m.Browse })),
);
const MapPage = lazy(() =>
  import("./pages/Browse").then((m) => ({ default: m.MapPage })),
);
const Locations = lazy(() =>
  import("./pages/Browse").then((m) => ({ default: m.Locations })),
);
const Projects = lazy(() =>
  import("./pages/Browse").then((m) => ({ default: m.Projects })),
);
const Investments = lazy(() =>
  import("./pages/Browse").then((m) => ({ default: m.Investments })),
);
const About = lazy(() =>
  import("./pages/Browse").then((m) => ({ default: m.About })),
);
const Contact = lazy(() =>
  import("./pages/Browse").then((m) => ({ default: m.Contact })),
);
const Legal = lazy(() =>
  import("./pages/Browse").then((m) => ({ default: m.Legal })),
);
const NotFound = lazy(() =>
  import("./pages/Browse").then((m) => ({ default: m.NotFound })),
);
export default function App() {
  const location = useLocation();
  const pathname = location.pathname.replace(/\/+$/, "") || "/";
  const [enquiry, setEnquiry] = useState<{
    property?: Property;
    kind: string;
  } | null>(null);
  const property = properties.find(
    (p) => pathname === `/properties/${p.id}`,
  );
  const visit = (p?: Property) => setEnquiry({ property: p, kind: "visit" });
  useEffect(() => {
    if (location.hash) {
      requestAnimationFrame(() =>
        document.getElementById(location.hash.slice(1))?.scrollIntoView(),
      );
    } else window.scrollTo(0, 0);
    const city = cities.find((c) =>
      location.pathname.includes(`/locations/${slugify(c)}`),
    );
    const names: Record<string, string> = {
      "/": "Delhi NCR Property Advisory",
      "/properties": "Properties for Sale & Rent in Delhi NCR",
      "/projects": "New Projects in Delhi NCR",
      "/map": "Delhi NCR Property Map",
      "/investments": "Investment Properties in Delhi NCR",
      "/locations": "Explore Delhi NCR Locations",
      "/contact": "Speak to a Property Advisor",
      "/about": "Independent Property Advisory",
      "/privacy": "Privacy Policy",
      "/terms": "Terms & Disclosures",
    };
    const locality = city && pathname.split('/').length > 3 ? pathname.split('/').at(-1)!.split('-').map(w=>w[0].toUpperCase()+w.slice(1)).join(' ') : city;
    document.title = `${property ? `${property.name}, ${property.locality}, ${property.city}` : locality ? `Property in ${locality}` : names[pathname] || "Page not found"} | RealEstate.co`;
    const description = property
      ? property.description
      : "Explore residential, commercial and investment properties across Delhi NCR. Search by location and budget, compare on the map and arrange a site visit.";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", description);
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", document.title);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute("content", description);
    const origin =
      import.meta.env.VITE_SITE_URL || "https://realestate-co.pages.dev";
    document
      .querySelector('meta[property="og:image"]')
      ?.setAttribute(
        "content",
        `${origin}/images/${property?.image || "tower"}.webp`,
      );
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", origin + pathname);
    document
      .querySelector('meta[property="og:url"]')
      ?.setAttribute("content", origin + pathname);
    for(const [name,value] of [['twitter:title',document.title],['twitter:description',description],['twitter:image',`${origin}/images/${property?.image || 'tower'}.webp`]]) document.querySelector(`meta[name="${name}"]`)?.setAttribute('content',value);
    const structured=document.querySelector('script[type="application/ld+json"]');
    if(structured) structured.textContent=JSON.stringify({'@context':'https://schema.org','@type':'WebPage',name:document.title,description,url:origin+pathname});
  }, [location.pathname, location.hash]);
  return (
    <>
      <Navbar onEnquire={() => setEnquiry({ kind: "requirement" })} />
      <main id="main">
        <Suspense
          fallback={
            <div className="container page-loading">Loading properties…</div>
          }
        >
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  onVisit={visit}
                  onEnquire={() => setEnquiry({ kind: "requirement" })}
                />
              }
            />
            <Route path="/properties" element={<Browse onVisit={visit} />} />
            <Route
              path="/properties/:id"
              element={
                <PropertyDetail
                  key={location.pathname}
                  onVisit={visit}
                  onFloorplan={(p) =>
                    setEnquiry({ property: p, kind: "floorplan" })
                  }
                />
              }
            />
            <Route path="/map" element={<MapPage />} />
            <Route path="/locations" element={<Locations onVisit={visit} />} />
            <Route
              path="/locations/:city"
              element={<Locations onVisit={visit} />}
            />
            <Route
              path="/locations/:city/:locality"
              element={<Locations onVisit={visit} />}
            />
            <Route path="/projects" element={<Projects />} />
            <Route
              path="/investments"
              element={<Investments onVisit={visit} />}
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Legal type="privacy" />} />
            <Route path="/terms" element={<Legal type="terms" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <MobileContactBar property={property} onVisit={() => visit(property)} />
      {enquiry && (
        <EnquiryModal {...enquiry} onClose={() => setEnquiry(null)} />
      )}
    </>
  );
}
