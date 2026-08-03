// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/eslint", "@nuxt/ui", "@peterbud/nuxt-query"],

  devtools: {
    enabled: true,
  },

  css: ["~/assets/css/main.css"],

  routeRules: {
    "/": { prerender: true },
  },

  // Only used for local `nuxt dev` (Vite/Nitro dev server) — production reads
  // runtimeConfig.apiUpstream instead (see server/routes/api/[...].ts), which
  // can be overridden at container runtime via NUXT_API_UPSTREAM.
  nitro: {
    devProxy: {
      "/api": {
        target: process.env.API_SERVER_URL || "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },

  // Nuxt automatically overrides this from the NUXT_API_UPSTREAM env var at
  // container startup (no rebuild required), so docker-compose.yaml can
  // point it at `api:${PORT}` without baking the value into the image. The
  // default below only applies to local `nuxt dev`/`nuxt preview`. See
  // server/routes/api/[...].ts for the proxy.
  runtimeConfig: {
    apiUpstream: "http://localhost:4000",
  },

  compatibilityDate: "2025-01-15",

  nuxtQuery: {
    autoImports: ["useQuery", "useInfiniteQuery"],
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },
});
