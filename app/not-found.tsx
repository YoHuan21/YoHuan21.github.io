import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { SplitHeading } from "@/components/ui/SplitHeading";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="relative flex min-h-[88svh] items-center overflow-hidden pt-[var(--nav-h)]">
      <div aria-hidden="true" className="glow-navy -right-40 top-0 h-[760px] w-[760px]" />
      <div aria-hidden="true" className="glow-blue right-[12%] top-[30%] h-[460px] w-[460px] opacity-70" />
      <p
        aria-hidden="true"
        className="font-display pointer-events-none absolute -right-[2vw] bottom-[-6vw] select-none text-[34vw] font-extralight leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgba(148,163,184,0.14)]"
      >
        404
      </p>
      <div className="container-x relative py-20">
        <p className="eyebrow anim-fade-up">Error 404</p>
        <SplitHeading text="This page took a *detour*." className="display-hero mt-6 max-w-4xl" />
        <p className="body-lg anim-fade-up mt-7 max-w-xl" style={{ animationDelay: "450ms" }}>
          The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back on track.
        </p>
        <div className="anim-fade-up mt-10 flex flex-wrap gap-3" style={{ animationDelay: "600ms" }}>
          <Link href="/" className="pill pill-white">
            <Icon name="arrowLeft" size={16} />
            Back home
          </Link>
          <Link href="/#work" className="pill pill-ghost">
            View selected work
          </Link>
        </div>
      </div>
    </section>
  );
}
