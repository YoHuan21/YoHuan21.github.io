"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { scrollToId } from "@/lib/scroll";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  /** Called on click, before scrolling (e.g. to close the mobile menu). */
  onNavigate?: () => void;
};

/**
 * Link that smooth-scrolls to "/#section" when already on the home page,
 * and navigates normally from other pages.
 */
export function AnchorLink({ href, onNavigate, onClick, ...rest }: Props) {
  const pathname = usePathname();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    onNavigate?.();
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;

    const onHome = pathname === "/" || pathname === "";
    const isHomeAnchor = href === "/" || href.startsWith("/#") || href.startsWith("#");
    if (!onHome || !isHomeAnchor) return;

    const id = href.includes("#") ? href.split("#")[1] : "";
    event.preventDefault();
    // Let a closing menu release the scroll lock before scrolling.
    requestAnimationFrame(() => {
      if (scrollToId(id)) {
        window.history.pushState(null, "", id ? `/#${id}` : "/");
      }
    });
  };

  return <Link href={href} onClick={handleClick} {...rest} />;
}
