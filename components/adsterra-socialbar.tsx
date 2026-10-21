'use client';

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { isGameOrFinderPath } from "@/lib/ad-routes";

const SOCIALBAR_SCRIPT_SRC =
  "https://pl29091402.profitablecpmratenetwork.com/41/15/19/41151986d269d097d57519a83bcfab95.js";
const MOBILE_MEDIA_QUERY = "(max-width: 768px)";

const normalizePathname = (pathname: string): string => {
  if (!pathname) {
    return "/";
  }

  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
};

const stripLocalePrefix = (pathname: string): string => {
  const match = pathname.match(/^\/([a-z]{2})(\/.*)?$/i);
  if (!match) {
    return pathname;
  }
  return match[2] ?? "/";
};

export default function AdsterraSocialBar() {
  const pathname = usePathname();
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);

    const updateVisibility = () => {
      const currentPath = pathname ?? "/";
      const hideOnMobile = mediaQuery.matches && isGameOrFinderPath(currentPath);
      setShouldLoad(!hideOnMobile);
    };

    updateVisibility();
    mediaQuery.addEventListener("change", updateVisibility);

    return () => {
      mediaQuery.removeEventListener("change", updateVisibility);
    };
  }, [pathname]);

  if (!shouldLoad) {
    return null;
  }

  return <Script strategy="afterInteractive" src={SOCIALBAR_SCRIPT_SRC} />;
}
