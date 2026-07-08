import { init, initData } from "@tma.js/sdk";
import { init as initVue } from "@tma.js/sdk-vue";

export interface InitDataAuthConfig<T = unknown> {
  /**
   * Authentication endpoint.
   */
  url?: string;

  /**
   * Returns the current authenticated user/session.
   * Should throw or reject if the user is not authenticated.
   */
  session?: () => Promise<T>;

  /**
   * Custom authentication request.
   */
  request?: (params: { url?: string; rawInitData: string }) => Promise<T>;

  headers?: HeadersInit;

  credentials?: RequestCredentials;
}

async function initDataAuth<T = unknown>(
  config: InitDataAuthConfig<T> = {},
): Promise<T> {
  // Already authenticated?
  if (config.session) {
    try {
      return await config.session();
    } catch {
      // not authenticated, continue with login
    }
  }

  const raw = initData.raw();

  if (!raw) {
    throw new Error("Telegram initData is missing.");
  }

  let result: T;

  if (config.request) {
    result = await config.request({
      url: config.url,
      rawInitData: raw,
    });
  } else {
    if (!config.url) {
      throw new Error("Either url or request must be provided.");
    }

    const response = await fetch(config.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
      credentials: config.credentials ?? "include",
      body: JSON.stringify({
        initData: raw,
      }),
    });

    if (!response.ok) {
      throw new Error(`Authentication failed (${response.status})`);
    }

    result = await response.json();
  }

  // Refresh authenticated user after login if possible.
  return config.session ? config.session() : result;
}

export { init, initVue, initDataAuth };
