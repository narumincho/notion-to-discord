# notion-to-discord

## build

```sh
deno run -A --allow-write=./dist.json --check ./build.ts
```

## run

`startInLocal.ts`

```ts
import { startServer } from "./main.tsx";

startServer({
  notionIntegrationSecret: "secret_xxx",
  discordWebHookUrl: "https://discord.com/api/webhooks/000/xxx",
});
```

```sh
deno run --unstable --allow-net=:8000,api.notion.com,discord.com --watch --check ./startInLocal.ts
```

## notificationToDiscord

`notificationToDiscordInLocal.ts`

```ts
import { notificationToDiscord } from "./main.tsx";

notificationToDiscord({
  notionIntegrationSecret: "secret_xxx",
  discordWebHookUrl: "https://discord.com/api/webhooks/000/xxx",
});
```

```sh
deno run --allow-net=api.notion.com,discord.com --check ./notificationToDiscordInLocal.ts
```
