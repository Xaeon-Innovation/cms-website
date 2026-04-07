import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { LegalMarkdown } from "@/components/legal/LegalMarkdown";

export default async function TermsPage() {
  const markdown = await readFile(
    path.join(process.cwd(), "TERMS_OF_SERVICE.md"),
    "utf8",
  );

  return (
    <div className="bg-surface pt-32 pb-24">
      <section className="mx-auto max-w-4xl px-6">
        <div className="rounded-3xl border border-outline-variant/20 bg-surface-container-low px-8 py-12 shadow-2xl md:px-12 md:py-16">
          <p className="text-sm font-body uppercase tracking-[0.28em] text-primary-fixed/70">
            Legal
          </p>
          <div className="mt-6">
            <LegalMarkdown markdown={markdown} />
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
