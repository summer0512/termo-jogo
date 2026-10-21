const CACHE_NAME = "termo-wordlists-v1";
const WORDLIST_PATH_PREFIXES = [
  "/api/wordlists/",
  "/api/local-wordlists/",
];

const isWordListRequest = (request) => {
  if (request.method !== "GET") {
    return false;
  }
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return false;
  }
  return WORDLIST_PATH_PREFIXES.some((prefix) => url.pathname.startsWith(prefix));
};

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return undefined;
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (!isWordListRequest(request)) {
    return;
  }

  event.respondWith(
    fetch(request, { cache: "no-store" })
      .then((response) => {
        if (response && response.ok) {
          const clone = response.clone();
          event.waitUntil(
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          );
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) {
          return cached;
        }
        throw new Error("Word list unavailable in network and cache.");
      })
  );
});
