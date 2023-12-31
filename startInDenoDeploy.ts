import { startServer } from "./main.tsx";

const notionIntegrationSecret = Deno.env.get("NOTION_INTEGRATION_SECRET");

if (!notionIntegrationSecret) {
  throw new Error("NOTION_INTEGRATION_SECRET is not set");
}

startServer({
  notionIntegrationSecret,
});
