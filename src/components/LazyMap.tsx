import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
const PropertyMap = lazy(() => import("./PropertyMap"));
export default function LazyMap(props: {
  initialCity?: string;
  initialId?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className="lazy-map">
      {visible ? (
        <Suspense
          fallback={
            <div className="map-loading">
              <MapPin />
              Loading the neighbourhood map…
            </div>
          }
        >
          <PropertyMap {...props} />
        </Suspense>
      ) : (
        <div className="map-loading">
          <MapPin />
          Explore Delhi NCR on the map
        </div>
      )}
    </div>
  );
}
