"use client";

import { useEffect, useState } from "react";

let hasNavigated = false;

/**
 * Soft fade between pages. Skipped on the very first load so the initial paint
 * is never hidden behind a fade (better LCP / Speed Index).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const [animate] = useState(() => hasNavigated);
  useEffect(() => {
    hasNavigated = true;
  }, []);
  return <div className={animate ? "page-enter" : undefined}>{children}</div>;
}
