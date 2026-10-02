import { footerLinks, site } from "@/data/content";
import { AnchorLink } from "@/components/ui/AnchorLink";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container-x flex flex-col items-center gap-6 py-10 text-center md:grid md:grid-cols-3 md:gap-4 md:text-left">
        <AnchorLink
          href="/"
          className="font-display inline-flex min-h-11 items-center text-[15px] font-medium tracking-[-0.01em] text-text md:justify-self-start"
        >
          {site.name}
        </AnchorLink>
        <ul className="flex items-center justify-center gap-2 md:justify-self-center">
          {footerLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="font-display inline-flex min-h-11 items-center rounded-full px-3 text-[13.5px] text-muted transition-colors duration-300 hover:text-accent-soft"
              >
                {link.label}
                {link.external && <span className="sr-only"> (opens in a new tab)</span>}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-[13px] text-muted md:justify-self-end">© {site.copyrightYear} {site.name}</p>
      </div>
    </footer>
  );
}
