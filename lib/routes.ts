import { SUPPORTED_WORD_LENGTHS, type SupportedWordLength } from "./wordLengths";

const DEFAULT_LOCALE = "pt";
const DEFAULT_GAME_LENGTH: SupportedWordLength = 5;

const localePrefix = (locale: string): string =>
  locale === DEFAULT_LOCALE ? "" : `/${locale}`;

const ensureLeadingSlash = (path: string): string =>
  path.startsWith("/") ? path : `/${path}`;

export const buildGamePath = (
  locale: string,
  length: SupportedWordLength
): string => {
  const prefix = localePrefix(locale);
  if (length === DEFAULT_GAME_LENGTH) {
    return prefix || "/";
  }
  return `${prefix}/termo-${length}-letras`;
};

export const buildSearchPath = (
  locale: string,
  length: SupportedWordLength
): string => {
  const prefix = localePrefix(locale);
  return `${prefix}/buscador-termo-${length}-letras`;
};

export const buildGuidePath = (
  locale: string,
  length: SupportedWordLength
): string => {
  const prefix = localePrefix(locale);
  return `${prefix}/guia-termo-${length}-letras`;
};

export const buildLengthOptions = (locale: string) =>
  SUPPORTED_WORD_LENGTHS.map((length) => ({
    length,
    href: ensureLeadingSlash(buildGamePath(locale, length)),
  }));

export const buildSearchHref = (
  locale: string,
  length: SupportedWordLength
): string => ensureLeadingSlash(buildSearchPath(locale, length));

export const buildSearchLengthOptions = (locale: string) =>
  SUPPORTED_WORD_LENGTHS.map((length) => ({
    length,
    href: ensureLeadingSlash(buildSearchPath(locale, length)),
  }));

export const buildChallengePath = (
  locale: string,
  length: SupportedWordLength
): string => ensureLeadingSlash(buildGamePath(locale, length));
