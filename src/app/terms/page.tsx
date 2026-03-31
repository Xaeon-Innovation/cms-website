import Link from "next/link";

const sections = [
  {
    title: "Use Of The Website",
    content:
      "By accessing this website, you agree to use it only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else’s use of the site. You agree not to misuse the website, attempt unauthorized access, or interfere with its operation.",
  },
  {
    title: "Service Information",
    content:
      "The content on this website is provided for general informational and marketing purposes. While we aim to keep information accurate and current, we do not guarantee that all descriptions, availability, or details will always be complete, current, or error-free.",
  },
  {
    title: "No Professional Or Medical Advice",
    content:
      "This website does not provide medical advice, diagnosis, or treatment. Any healthcare-related information on the site is general in nature and should not be treated as a substitute for consultation with qualified medical professionals.",
  },
  {
    title: "Intellectual Property",
    content:
      "All text, branding, design elements, graphics, and other content on this website are owned by or licensed to Creative Multi Solutions unless otherwise stated. You may not copy, reproduce, distribute, or use site content without prior written permission except as allowed by law.",
  },
  {
    title: "Third-Party Links And Services",
    content:
      "This website may include links to third-party websites or services for convenience. We are not responsible for the content, privacy practices, or operation of external sites.",
  },
  {
    title: "Limitation Of Liability",
    content:
      "To the fullest extent permitted by law, Creative Multi Solutions shall not be liable for any indirect, incidental, consequential, or special damages arising from or related to the use of this website or reliance on its content.",
  },
  {
    title: "Changes To These Terms",
    content:
      "We may revise these Terms of Service at any time by updating this page. Continued use of the website after changes are posted constitutes acceptance of the revised terms.",
  },
];

export default function TermsPage() {
  return (
    <div className="bg-surface pt-32 pb-24">
      <section className="mx-auto max-w-4xl px-6">
        <div className="rounded-3xl border border-outline-variant/20 bg-surface-container-low px-8 py-12 shadow-2xl md:px-12 md:py-16">
          <p className="text-sm font-body uppercase tracking-[0.28em] text-primary-fixed/70">
            Legal
          </p>
          <h1 className="mt-4 text-4xl font-display font-medium text-primary md:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-foreground/70 md:text-lg">
            These Terms of Service govern your access to and use of the Creative
            Multi Solutions website.
          </p>

          <div className="mt-12 space-y-8">
            {sections.map((section) => (
              <div
                key={section.title}
                className="rounded-2xl border border-outline-variant/15 bg-surface-container/50 p-6"
              >
                <h2 className="text-2xl font-display text-primary">
                  {section.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-foreground/75 md:text-base">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 border-t border-outline-variant/15 pt-8 text-sm leading-7 text-foreground/65">
            For service-specific questions, please reach out through our{" "}
            <Link href="/contact" className="text-primary hover:text-primary-fixed">
              contact page
            </Link>
            .
          </div>
        </div>
      </section>
    </div>
  );
}
