import { configureClient } from "@pkg/api/config";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  configureClient({
    baseUrl: config.public.apiBaseUrl || "/api",
  });
});
