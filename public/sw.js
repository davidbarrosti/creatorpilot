// Minimal service worker — enables "Add to Home Screen" / PWA installability.
// Intentionally no offline caching yet (data is highly dynamic — earnings,
// collab status); revisit once real API integration lands in Sprint 7.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
