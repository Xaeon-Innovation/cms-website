/**
 * Static office map — OpenStreetMap embed (no API key, no billing).
 * Coordinates: approximate pin for AlWadi Building area, Sheikh Zayed Road, Dubai.
 * Adjust LAT/LON if you want the pin exact.
 */
const LAT = 25.2047;
const LON = 55.2712;
/** Half-width of the map in degrees (~few city blocks) */
const DELTA = 0.012;

function buildOsmEmbedSrc() {
  const minLon = LON - DELTA;
  const minLat = LAT - DELTA;
  const maxLon = LON + DELTA;
  const maxLat = LAT + DELTA;
  const bbox = `${minLon},${minLat},${maxLon},${maxLat}`;
  const params = new URLSearchParams({
    bbox,
    layer: "mapnik",
    marker: `${LAT},${LON}`,
  });
  return `https://www.openstreetmap.org/export/embed.html?${params.toString()}`;
}

const OSM_MAP_URL = `https://www.openstreetmap.org/?mlat=${LAT}&mlon=${LON}#map=16/${LAT}/${LON}`;

export function ContactMapEmbed() {
  const src = buildOsmEmbedSrc();

  return (
    <div className="w-full space-y-2">
      <div className="h-64 rounded-sm ghost-border overflow-hidden border border-outline-variant/20">
        <iframe
          title="Office location map"
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={src}
        />
      </div>
      <p className="text-[10px] font-body text-foreground/45 leading-relaxed">
        Map data ©{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-foreground/70"
        >
          OpenStreetMap
        </a>{" "}
        contributors ·{" "}
        <a
          href={OSM_MAP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-foreground/70"
        >
          Open larger map
        </a>
      </p>
    </div>
  );
}
