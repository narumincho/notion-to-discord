import { h } from "https://esm.sh/preact@10.19.3?pin=v135";
import { renderToString } from "https://esm.sh/preact-render-to-string@6.3.1?pin=v135";
import { App } from "./app.tsx";
import dist from "./dist.json" with { type: "json" };
import { Client } from "https://deno.land/x/notion_sdk@v2.2.3/src/mod.ts";

export const startServer = (
  parameter: { readonly notionIntegrationSecret: string },
): void => {
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
          const notionClient = new Client({
            auth: parameter.notionIntegrationSecret,
          });
          const taskList = await getTasksCompleted(notionClient, (log) => {
            controller.enqueue(new TextEncoder().encode(log + "\n"));
          });
          controller.enqueue(
            new TextEncoder().encode(
              JSON.stringify(taskList, undefined, 2) + "\n",
            ),
          );
          controller.enqueue(new TextEncoder().encode("完了!\n"));
          controller.close();
        },
      });
      return new Response(body, { headers: { "content-type": "text/plain" } });
    }
    return new Response("Not Found", { status: 404 });
  });
};

type Task = {
  readonly id: string;
  readonly name: string;
  readonly lv: "Lv. 1" | "Lv. 10";
  readonly userId: string;
};

const getTasksCompleted = async (
  notionClient: Client,
  warnLog: (text: string) => void,
): Promise<ReadonlyArray<Task>> => {
  const task: Task[] = [];
  let cursor: string | undefined = undefined;
  while (true) {
    const taskCompleted = await notionClient.databases.query({
      database_id: "09570165012942c8bf11b78f71b52683",
      start_cursor: cursor,
      filter: {
        type: "select",
        property: "ステータス",
        select: {
          equals: "完了",
        },
      },
    });
    task.push(
      ...taskCompleted.results.flatMap<Task>((page) => {
        if (!("properties" in page)) {
          return [];
        }
        const nameProperty = page.properties["名前"];
        if (nameProperty.type !== "title") {
          warnLog(`名前がタイトルじゃない ${nameProperty.type}`);
          return [];
        }

        const userProperty = page.properties["ユーザー"];
        if (userProperty.type !== "relation") {
          warnLog(`ユーザーがリレーションじゃない ${userProperty.type}`);
          return [];
        }

        const lvProperty = page.properties["Lv"];
        if (lvProperty.type !== "select") {
          warnLog(`Lvがセレクトじゃない ${lvProperty.type}`);
          return [];
        }

        return [{
          id: page.id,
          name: nameProperty.title.map((item) => item.plain_text).join(""),
          lv: lvProperty.select?.name as Task["lv"],
          userId: userProperty.relation[0].id,
        }];
      }),
    );
    if (!taskCompleted.next_cursor) {
      return task;
    }
    cursor = taskCompleted.next_cursor;
  }
};

const congratulatoryWords: ReadonlySet<string> = new Set([
  "お疲れー。",
  "まあ頑張ったんじゃない？",
  "偉業の国…なんちゃって",
  "はいはい。次は？",
  "Tomopiloくんも喜んでるよ。",
  "つるちゃんぬに負けるな！",
  "しの抹茶くんも感激してる。",
  "お餅くん、褒めてあげて？",
  "一方Kish.はまだ寝てるみたい。",
  "これにはヤソくんもにっこり。",
  "らこちゃんもびっくりしてるよ。",
  "じゃあ…そこのKish.さん、コメントをどうぞ",
  "MINA君が焦ってる！",
  "猪瀬君、これってすごいの？",
  "特別にささやまくんから笹をプレゼント。",
  "A2は　スーパーハイテンションになった！",
  "はいはいえらいえらい。",
  "褒めればいいんでしょ褒めれば。すごいねー。",
  "もっと早くやれたような気はするけど。",
  "お疲れさま。頑張ったじゃない。",
  "ん。頑張ったねー。",
  "まだやることあるでしょ？",
  "…にやにやしないでよ。気持ち悪い。",
  "で？",
  "通知うざくない？大丈夫？",
  "やる気を感じる。",
  "で、君は？",
  "カレーうどんくらいなら奢るけど。遠慮しなくていいよ。",
  "まだまだこっから！",
  "いいぞいいぞいいぞ！って感じ。",
  "う〜ん これは :aiseru: かも。",
  "ガンガンいきましょ！",
  "可不ちゃんって呼ぶな！",
]);

/**
 * ランダムなねぎらいの言葉
 */
const getRandomCongratulatoryWord = (): string =>
  [
    ...congratulatoryWords,
  ][Math.floor(Math.random() * congratulatoryWords.size)];
