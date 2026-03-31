import Link from "next/link";

const sections = [
  {
    title: "Information We Collect",
    content:
      "We may collect the information you submit through our forms, including your name, phone number, email address, organization details, and any message you choose to send. We may also collect limited technical information such as browser type, device information, and usage data needed to operate and improve the website.",
  },
  {
    title: "How We Use Information",
    content:
      "We use submitted information to respond to inquiries, provide requested services, improve our marketing and support workflows, maintain website security, and communicate with prospective or current clients. We do not sell your personal information to third parties.",
  },
  {
    title: "Data Sharing",
    content:
      "We may share information with trusted service providers and technical partners only where necessary to run our business, host the website, manage leads, or deliver requested services. These parties are expected to handle data responsibly and only for authorized purposes.",
  },
  {
    title: "Data Retention",
    content:
      "We keep personal information only for as long as reasonably necessary to fulfill the purpose for which it was collected, comply with legal obligations, resolve disputes, and enforce our agreements.",
  },
  {
    title: "Your Choices",
    content:
      "You may request access to, correction of, or deletion of the personal information you have provided to us, subject to legal or operational requirements. To make such a request, please contact us using the details provided on our contact page.",
  },
  {
    title: "Security",
    content:
      "We take reasonable technical and organizational measures to protect information against unauthorized access, disclosure, alteration, or destruction. However, no internet-based system can be guaranteed to be completely secure.",
  },
  {
    title: "Updates To This Policy",
    content:
      "We may update this Privacy Policy from time to time. Any future revisions will be posted on this page with updated wording as needed.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-surface pt-32 pb-24">
      <section className="mx-auto max-w-4xl px-6">
        <div className="rounded-3xl border border-outline-variant/20 bg-surface-container-low px-8 py-12 shadow-2xl md:px-12 md:py-16">
          <p className="text-sm font-body uppercase tracking-[0.28em] text-primary-fixed/70">
            Legal
          </p>
          <h1 className="mt-4 text-4xl font-display font-medium text-primary md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-foreground/70 md:text-lg">
            This Privacy Policy explains how Creative Multi Solutions collects,
            uses, and protects information submitted through this website.
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
            If you have questions about this policy, please contact us through the{" "}
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
