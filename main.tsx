import { h } from "https://esm.sh/preact@10.19.3?pin=v135";
import { renderToString } from "https://esm.sh/preact-render-to-string@6.3.1?pin=v135";
import { App } from "./app.tsx";
import dist from "./dist.json" with { type: "json" };
import { delay } from "https://deno.land/std@0.210.0/async/delay.ts";

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
          <body style="height: 100%; margin: 0">
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
        controller.enqueue(new TextEncoder().encode("処理中...\n"));
        await delay(2000);
        controller.enqueue(new TextEncoder().encode("完了! (ダミー)\n"));
        controller.close();
      },
    });
    return new Response(body, { headers: { "content-type": "text/plain" } });
  }
  return new Response("Not Found", { status: 404 });
});
