import {
  userControllerMe,
  userControllerTelegramAuth,
} from "@pkg/api/client/vue";
import { initDataAuth, initVue } from "@pkg/tma/client";

export default defineNuxtPlugin(async () => {
  initVue();

  let userSession;

  try {
    userSession = await initDataAuth({
      request: async ({ rawInitData }) =>
        // TODO: typing this shit
        userControllerTelegramAuth({ initData: rawInitData } as any),

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
