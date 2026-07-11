import { defineConfig } from "prisma/config";
import { env } from "@tooling/env/prisma";

console.log("prisma.comfig.ts env", env);

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env.DATABASE_URL,
  },
});
