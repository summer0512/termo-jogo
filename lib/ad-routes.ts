// src/lib/ad-routes.ts

const normalizePathname = (pathname: string): string => {
  if (!pathname) return "/";

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

export const isGameOrFinderPath = (pathname: string): boolean => {
  const normalized = normalizePathname(pathname);
  const route = stripLocalePrefix(normalized);

  if (route === "/") {
    return true;
  }

  if (/^\/termo-\d+-letras$/i.test(route)) {
    return true;
  }

  if (route === "/buscador-termo") {
    return true;
  }

  if (/^\/buscador-termo-\d+-letras$/i.test(route)) {
    return true;
  }

  return false;
};