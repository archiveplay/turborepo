// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/eslint", "@nuxt/ui", "@peterbud/nuxt-query"],

  devtools: {
    enabled: true,
  },

  css: ["~/assets/css/main.css"],

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || "/api",
    },
  },

  routeRules: {
    "/": { prerender: true },
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
