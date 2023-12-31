import { startServer } from "./main.tsx";

const notionIntegrationSecret = Deno.env.get("NOTION_INTEGRATION_SECRET");

if (!notionIntegrationSecret) {
  throw new Error("NOTION_INTEGRATION_SECRET is not set");
}

const discordWebHookUrl = Deno.env.get("DISCORD_WEBHOOK_URL");

if (!discordWebHookUrl) {
  throw new Error("DISCORD_WEBHOOK_URL is not set");
}

startServer({
  notionIntegrationSecret,
  discordWebHookUrl,
});
