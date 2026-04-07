import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  markdown: string;
};

function isInternalHref(href: string) {
  return href.startsWith("/") || href.startsWith("#");
}

export function LegalMarkdown({ markdown }: Props) {
  return (
    <div className="prose prose-invert max-w-none prose-headings:font-display prose-h1:text-4xl prose-h1:font-medium prose-h1:text-primary md:prose-h1:text-5xl prose-h2:mt-10 prose-h2:text-2xl prose-h2:text-primary prose-h3:text-xl prose-h3:text-primary prose-p:leading-8 prose-a:text-primary prose-a:no-underline hover:prose-a:text-primary-fixed prose-strong:text-foreground prose-li:marker:text-foreground/50">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a({ href, children, ...props }) {
            const safeHref = typeof href === "string" ? href : "";
            if (!safeHref) return <span {...props}>{children}</span>;
            if (isInternalHref(safeHref)) {
              return (
                <Link href={safeHref} {...props}>
                  {children}
                </Link>
              );
            }
            return (
              <a
                href={safeHref}
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}

