import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import Home from "./pages/Home";
import PropertyDetail from "./pages/PropertyDetail";
import {
  Browse,
  MapPage,
  Locations,
  Projects,
  Investments,
  About,
  Contact,
  Legal,
  NotFound,
} from "./pages/Browse";
import { Navbar, Footer } from "./components/Layout";
import { Routes, Route } from "react-router-dom";
export { properties, locations, cities, slugify } from "./data/properties";
const noop = () => {};
export function render(path: string) {
  return renderToString(
    <StaticRouter location={path}>
      <Navbar onEnquire={noop} />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home onVisit={noop} onEnquire={noop} />} />
          <Route path="/properties" element={<Browse onVisit={noop} />} />
          <Route
            path="/properties/:id"
            element={<PropertyDetail onVisit={noop} onFloorplan={noop} />}
          />
          <Route path="/locations" element={<Locations onVisit={noop} />} />
          <Route
            path="/locations/:city"
            element={<Locations onVisit={noop} />}
          />
          <Route
            path="/locations/:city/:locality"
            element={<Locations onVisit={noop} />}
          />
          <Route path="/projects" element={<Projects />} />
          <Route path="/investments" element={<Investments onVisit={noop} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/privacy" element={<Legal type="privacy" />} />
          <Route path="/terms" element={<Legal type="terms" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </StaticRouter>,
  );
}
