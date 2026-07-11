import {
  userControllerMe,
  userControllerTelegramAuth,
} from "@pkg/api/client/vue";
import { initDataAuth } from "@pkg/tma/client";
import {
  initData,
  init,
  miniApp,
  themeParams,
  retrieveLaunchParams,
} from "@tma.js/sdk-vue";

export default defineNuxtPlugin(async () => {
  init();

  initData.restore();

  if (miniApp.mount.isAvailable()) {
    themeParams.mount();
    miniApp.mount();
    themeParams.bindCssVars();
  }

  let userSession;

  try {
    userSession = await initDataAuth({
      request: async ({ rawInitData }) =>
        userControllerTelegramAuth({
          body: JSON.stringify({ initData: rawInitData }),
        }),

      credentials: "include",

      session: userControllerMe,
    });

    console.log("Telegram authentication completed");
  } catch (error) {
    console.error("Telegram authentication failed:", error);
  }

  if (!userSession) return;

  console.log("user session", userSession);
  // TODO: make auth store
  // useAuthStore().setUserSession(userSession)
});
