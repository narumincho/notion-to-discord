import { h } from "https://esm.sh/preact@10.19.3?pin=v135";
import { renderToString } from "https://esm.sh/preact-render-to-string@6.3.1?pin=v135";
import { App } from "./app.tsx";
import dist from "./dist.json" with { type: "json" };
import { Client } from "https://deno.land/x/notion_sdk@v2.2.3/src/mod.ts";
import { getTasksCompleted, setTaskCompletedAndCommented } from "./task.ts";
import { commentToDiscord } from "./commentToDiscord.ts";

export const start = (
  parameter: {
    readonly notionIntegrationSecret: string;
    readonly discordWebHookUrl: string;
  },
): void => {
  Deno.cron("task complete check", "* * * * *", async () => {
    console.log("タスク通知 処理開始");
    const notionClient = new Client({
      auth: parameter.notionIntegrationSecret,
    });
    const taskList = await getTasksCompleted(notionClient, console.warn);
    if (taskList.length === 0) {
      console.log("タスクなし");
      return;
    }
    const userMap = await getUserMap(notionClient);
    for (const task of taskList) {
      console.log(`タスク通知 ${task.id}`);
      await commentToDiscord({
        discordWebHookUrl: parameter.discordWebHookUrl,
        task,
        userMap,
      });
      await setTaskCompletedAndCommented(notionClient, task.id);
    }
    console.log("タスク通知 すべて完了");
  });

  Deno.serve((request) => {
    const url = new URL(request.url);
    if (url.pathname === "/" && request.method === "GET") {
      return new Response(
        "<!doctype html>" + renderToString(
          <html style="height: 100%;">
            <head>
              <title>提出埋め込み用ページ</title>
              <meta charset="utf-8" />
              <script
                type="module"
                src={`/${dist.jsHash}`}
              />
            </head>
            <body style="height: 100%; margin: 0;background: white;">
              <div id="root" style="height: 100%;">
                <App state={undefined} onClick={undefined} />
              </div>
            </body>
          </html>,
        ),
        {
          headers: {
            "content-type": "text/html",
          },
        },
      );
    }
    if (url.pathname === `/${dist.jsHash}` && request.method === "GET") {
      return new Response(
        dist.jsCode,
        {
          headers: {
            "content-type": "text/javascript",
          },
        },
      );
    }
    if (url.pathname === "/submit" && request.method === "POST") {
      const body = new ReadableStream<Uint8Array>({
        start: async (controller) => {
          controller.enqueue(
            new TextEncoder().encode(`処理開始 ${new Date().toISOString()}\n`),
          );
          try {
            const notionClient = new Client({
              auth: parameter.notionIntegrationSecret,
            });

            controller.enqueue(
              new TextEncoder().encode("ユーザー一覧を取得...\n"),
            );
            const userMap = await getUserMap(notionClient);
            controller.enqueue(
              new TextEncoder().encode(
                JSON.stringify([...userMap], undefined, 2) + "\n",
              ),
            );

            controller.enqueue(
              new TextEncoder().encode("振り返り通知送信完了!\n"),
            );
          } catch (error) {
            controller.enqueue(new TextEncoder().encode(error + "\n"));
          }
          controller.close();
        },
      });
      return new Response(body, { headers: { "content-type": "text/plain" } });
    }
    return new Response("Not Found", { status: 404 });
  });
};

const getUserMap = async (
  notionClient: Client,
): Promise<ReadonlyMap<string, string>> => {
  const users = new Map<string, string>();
  let cursor: string | undefined = undefined;
  while (true) {
    const response = await notionClient.databases.query({
      database_id: "94fbeb491c7e43c6a550f09f91fe50fa",
      start_cursor: cursor,
    });
    response.results.forEach((page) => {
      if (!("properties" in page)) {
        return;
      }
      const nameProperty = page.properties["名前"];
      if (nameProperty.type !== "title") {
        return;
      }
      users.set(
        page.id,
        nameProperty.title.map((item) => item.plain_text).join(""),
      );
    });
    if (!response.next_cursor) {
      return users;
    }
    cursor = response.next_cursor;
  }
};
