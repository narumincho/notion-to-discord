# notion-to-discord

## build

```sh
deno run -A --allow-write=./dist.json --check ./build.ts
```

## run

```ts
import { startServer } from "./main.tsx";

startServer({
  notionIntegrationSecret: "secret_aaa",
});
```

```sh
deno run --allow-net=:8000,api.notion.com,discord.com --watch --check ./startInLocal.ts
```
