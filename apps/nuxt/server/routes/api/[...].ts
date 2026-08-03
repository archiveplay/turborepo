// Requests to "/api/*" are forwarded to the API with the "/api" prefix
// STRIPPED, so the default baseUrl of @pkg/api ("/api", see
// packages/api/fetcher.ts) works unchanged in prod, and the browser only
// ever talks to this same origin (no CORS).
//
// `runtimeConfig.apiUpstream` is resolved at request time from
// `useRuntimeConfig()`, which Nuxt overrides at container startup via the
// NUXT_API_UPSTREAM env var (docker-compose.yaml sets it to `api:${PORT}`) —
// unlike Nitro's `routeRules.proxy` shortcut, this is NOT baked at build time.
export default defineEventHandler((event) => {
  const { apiUpstream } = useRuntimeConfig();

  // `event.path` is the full request path including the query string, so
  // this preserves query params the same way nginx's proxy_pass does.
  const target = `${apiUpstream}${event.path.replace(/^\/api/, "")}`;

  return proxyRequest(event, target);
});
