const CACHE_NAME = "tff-cache-v1";
const ASSETS = [
  "/",
  "/site.webmanifest",
  "/robots.txt"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (e) => {
  const url = e.request.url;
  // Bypass non-GET, development websockets, Nitro APIs, or hot-reload assets
  if (
    e.request.method !== "GET" ||
    url.includes("/api/") ||
    url.includes("/_nitro/") ||
    url.includes("ws") ||
    url.includes("hot-update")
  ) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request)
        .then((networkResponse) => {
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== "basic"
          ) {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          if (e.request.mode === "navigate") {
            return caches.match("/");
          }
        });
    })
  );
});
