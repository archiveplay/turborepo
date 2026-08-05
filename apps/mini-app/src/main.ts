import "./assets/index.css";

import { createApp } from "vue";
import { retrieveLaunchParams } from "@tma.js/sdk-vue";
import { QueryClient, VueQueryPlugin } from "@tanstack/vue-query";

import App from "./App.vue";
import router from "./router";
import { errorHandler } from "./errorHandler";
import { init } from "./init";
import { TonConnectUIPlugin } from "./tonconnect";
import { publicUrl } from "./helperts/publicUrl";

// Mock the environment in case, we are outside Telegram.
import "./mockEnv";
import { configureClient } from "@pkg/api/config";

configureClient({ baseUrl: import.meta.env.VITE_API_URL || "http://37.1.222.5:4000/api" })

const launchParams = retrieveLaunchParams();
const { tgWebAppPlatform: platform } = launchParams;
const debug =
  (launchParams.tgWebAppStartParam || "").includes("debug") ||
  import.meta.env.DEV;

// Configure all application dependencies.
init({
  debug,
  eruda: debug && ["ios", "android"].includes(platform),
  mockForMacOS: platform === "macos",
}).then(() => {
  const app = createApp(App);
  app.config.errorHandler = errorHandler;
  app.use(router);
  app.use(VueQueryPlugin, {
    queryClient: new QueryClient(),
  });
  app.use(TonConnectUIPlugin, {
    manifestUrl: publicUrl("tonconnect-manifest.json"),
  });
  app.mount("#app");
});
