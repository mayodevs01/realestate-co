import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import {
  render,
  properties,
  locations,
  cities,
  slugify,
} from "../.prerender/entry-server.js";
const template = await readFile("dist/index.html", "utf8");
const origin = process.env.VITE_SITE_URL || "https://realestate-co.pages.dev";
const routes = [
  "/",
  "/properties",
  "/map",
  "/locations",
  "/projects",
  "/investments",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  ...properties.map((p) => `/properties/${p.id}`),
  ...cities.map((c) => `/locations/${slugify(c)}`),
  ...locations.flatMap((l) =>
    l.areas.map((a) => `/locations/${slugify(l.name)}/${slugify(a)}`),
  ),
];
const esc = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
for (const route of [...routes, "/404"]) {
  const p = properties.find((p) => route === `/properties/${p.id}`);
  const loc = route.startsWith("/locations/")
    ? route
        .split("/")
        .at(-1)
        .split("-")
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(" ")
    : null;
  const pageNames = {
    "/": "Delhi NCR Property Advisory",
    "/properties": "Flats for Sale & Rent in Delhi NCR",
    "/map": "Delhi NCR Property Map",
    "/locations": "Explore Delhi NCR Locations",
    "/projects": "New Projects in Delhi NCR",
    "/investments": "Investment Properties in Delhi NCR",
    "/about": "Independent Property Advisory",
    "/contact": "Property Dealers in Delhi NCR",
    "/privacy": "Privacy Policy",
    "/terms": "Terms & Disclosures",
    "/404": "Page Not Found",
  };
  const title = `${p ? `${p.name}, ${p.locality}, ${p.city}` : loc ? `Property in ${loc}` : pageNames[route]} | RealEstate.co`;
  const description = p
    ? p.description
    : loc
      ? `Explore property in ${loc}, Delhi NCR. Compare demo listings, prices and locations, and speak to RealEstate.co about your requirement.`
      : "Search residential, commercial and investment properties across Delhi NCR. Explore the map, compare locations and request a site visit with RealEstate.co.";
  const schema = p
    ? {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: title,
        description,
        url: origin + route,
        about: {
          "@type": "Place",
          name: p.name,
          address: {
            "@type": "PostalAddress",
            addressLocality: p.city,
            addressRegion:
              p.city === "Gurugram"
                ? "Haryana"
                : p.city === "Delhi"
                  ? "Delhi"
                  : "Uttar Pradesh",
            addressCountry: "IN",
          },
        },
      }
    : {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "RealEstate.co",
        description: "Fictional Delhi NCR property advisory demonstration",
        url: origin,
      };
  const metadata = `<link rel="canonical" href="${origin + route}"/><meta property="og:url" content="${origin + route}"/><meta property="og:image" content="${origin}/images/${p?.image || "tower"}.webp"/><meta name="twitter:card" content="summary_large_image"/><meta name="twitter:title" content="${esc(title)}"/><meta name="twitter:description" content="${esc(description)}"/><meta name="twitter:image" content="${origin}/images/${p?.image || "tower"}.webp"/><script type="application/ld+json">${JSON.stringify(schema).replaceAll("<", "\\u003c")}</script>${route === "/404" ? '<meta name="robots" content="noindex"/>' : ""}`;
  let html = template
    .replace(/<title>.*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(
      /(<meta\s+name="description"\s+content=")[^"]*("\s*\/?>)/,
      `$1${esc(description)}$2`,
    )
    .replace(
      /(<meta\s+property="og:title"\s+content=")[^"]*("\s*\/?>)/,
      `$1${esc(title)}$2`,
    )
    .replace(
      /(<meta\s+property="og:description"\s+content=")[^"]*("\s*\/?>)/,
      `$1${esc(description)}$2`,
    )
    .replace("</head>", metadata + "</head>")
    .replace('<div id="root"></div>', `<div id="root">${render(route)}</div>`);
  const folder = route === "/" || route === "/404" ? "dist" : `dist${route}`;
  await mkdir(folder, { recursive: true });
  await writeFile(
    route === "/404" ? "dist/404.html" : `${folder}/index.html`,
    html,
  );
}
await writeFile(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((r) => `<url><loc>${origin + r}</loc></url>`).join("")}</urlset>`,
);
await writeFile(
  "dist/robots.txt",
  `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n`,
);
await rm(".prerender", { recursive: true, force: true });
console.log(
  `Pre-rendered ${routes.length} crawlable pages, plus 404, sitemap and robots.txt.`,
);
