import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "https://localhost:7152/openapi.json",
  output: "src/api",
  plugins: [
    {
      name: "@hey-api/typescript",
      enums: "javascript",
    },
    "@hey-api/sdk",
  ],
});