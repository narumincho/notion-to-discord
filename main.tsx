import { h } from "https://esm.sh/preact@10.19.3?pin=v135";
import { renderToString } from "https://esm.sh/preact-render-to-string@6.3.1?pin=v135";
import { App } from "./app.tsx";

Deno.serve((request) => {
  const url = new URL(request.url);
  if (url.pathname === "/" && request.method === "GET") {
    return new Response(
      renderToString(
        <html style="height: 100%;">
          <head>
            <title>提出埋め込み用ページ</title>
            <meta charset="utf-8" />
          </head>
          <body style="height: 100%; margin: 0">
            <App />
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
  if (url.pathname === "/submit" && request.method === "POST") {
    return new Response("OK", {});
  }
  return new Response("Not Found", { status: 404 });
});
