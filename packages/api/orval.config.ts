import { z } from "zod";
import { configDotenv } from "dotenv";

configDotenv();

const orvalConfigSchema = z.object({
  OPENAPI_INPUT_SRC: z.url(),
});

const env = orvalConfigSchema.parse(process.env);

export default {
  apiVue: {
    input: env.OPENAPI_INPUT_SRC,
    output: {
      target: "./clients/vue.ts",
      client: "vue-query",
      mode: "single",
      override: {
        mutator: {
          path: "./fetcher.ts",
          name: "customFetch",
        },
      },
    },
  },

  apiReact: {
    input: env.OPENAPI_INPUT_SRC,
    output: {
      target: "./clients/react.ts",
      client: "react-query",
      mode: "single",
      override: {
        mutator: {
          path: "./fetcher.ts",
          name: "customFetch",
        },
      },
    },
  },

  apiCore: {
    input: env.OPENAPI_INPUT_SRC,
    output: {
      target: "./clients/core.ts",
      client: "fetch",
      mode: "single",
      override: {
        mutator: {
          path: "./fetcher.ts",
          name: "customFetch",
        },
      },
    },
  },
};
