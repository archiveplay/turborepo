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

  nitro: {
    devProxy: {
      "/api": {
        target: process.env.API_SERVER_URL || "http://localhost:4001",
        changeOrigin: true,
      },
    },
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
