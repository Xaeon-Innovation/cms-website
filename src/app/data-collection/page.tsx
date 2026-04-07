import Link from "next/link";
import { LegalMarkdown } from "@/components/legal/LegalMarkdown";
import { DATA_COLLECTION_NOTICE_MD } from "@/content/legal";

export default function DataCollectionPage() {
  return (
    <div className="bg-surface pt-32 pb-24">
      <section className="mx-auto max-w-4xl px-6">
        <div className="rounded-3xl border border-outline-variant/20 bg-surface-container-low px-8 py-12 shadow-2xl md:px-12 md:py-16">
          <p className="text-sm font-body uppercase tracking-[0.28em] text-primary-fixed/70">
            Legal
          </p>
          <div className="mt-6">
            <LegalMarkdown markdown={DATA_COLLECTION_NOTICE_MD} />
          </div>

          <div className="mt-12 border-t border-outline-variant/15 pt-8 text-sm leading-7 text-foreground/65">
            If you have questions about this notice, please contact us through the{" "}
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

