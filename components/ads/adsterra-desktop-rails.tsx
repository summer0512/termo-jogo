"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import AdsterraBanner from "./adsterra-banner";
import { isGameOrFinderPath } from "@/lib/ad-routes";

const DESKTOP_RAIL_QUERY = "(min-width: 1440px)";

const placements = {
  left: {
    enabled: true,
    width: 160,
    height: 300,
    keyId: "416edb832e8c870b28de1fc4b454989b",
    scriptSrc:
      "https://www.highperformanceformat.com/416edb832e8c870b28de1fc4b454989b/invoke.js",
  },

  right: {
    enabled: true,
    width: 160,
    height: 600,
    keyId: "514dc6b746b3cd8aec57a230f5482089",
    scriptSrc:
      "https://www.highperformanceformat.com/514dc6b746b3cd8aec57a230f5482089/invoke.js",
  },
} as const;

export default function AdsterraDesktopRails() {
  const pathname = usePathname();
  const [isWideDesktop, setIsWideDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_RAIL_QUERY);

    const update = () => {
      setIsWideDesktop(mediaQuery.matches);
    };

    update();

    mediaQuery.addEventListener("change", update);

    return () => {
      mediaQuery.removeEventListener("change", update);
    };
  }, []);

  if (!isWideDesktop) {
    return null;
  }

  if (!isGameOrFinderPath(pathname ?? "/")) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none
        fixed
        inset-x-0
        top-[120px]
        z-10
        hidden
        min-[1440px]:block
      "
    >
      {placements.left.enabled && (
        <div className="pointer-events-auto absolute right-[calc(50%+532px)] top-0">
          <AdsterraBanner
            {...placements.left}
            label="Left Ad"
          />
        </div>
      )}

      {placements.right.enabled && (
        <div className="pointer-events-auto absolute left-[calc(50%+532px)] top-0">
          <AdsterraBanner
            {...placements.right}
            label="Right Ad"
          />
        </div>
      )}
    </div>
  );
}