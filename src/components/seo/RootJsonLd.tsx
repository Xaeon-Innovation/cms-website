import { absoluteUrl, getSiteUrl } from "@/lib/siteUrl";

const ORG_NAME = "Creative Multi Solutions";

export default function RootJsonLd() {
  const url = getSiteUrl();
  const logo = absoluteUrl("/favicon.ico");
  const payload = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${url}/#organization`,
        name: ORG_NAME,
        url,
        logo: {
          "@type": "ImageObject",
          url: logo,
        },
        description:
          "Dubai-based medical marketing and digital marketing agency serving UAE hospitals, clinics, and healthcare organizations with B2B growth and patient acquisition programs.",
        areaServed: {
          "@type": "Country",
          name: "United Arab Emirates",
        },
        knowsAbout: [
          "Medical marketing",
          "Healthcare marketing",
          "Digital marketing",
          "Patient acquisition",
          "Hospital marketing",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        name: ORG_NAME,
        url,
        publisher: { "@id": `${url}/#organization` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}
