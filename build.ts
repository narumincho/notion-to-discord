import { bundle } from "https://deno.land/x/emit@0.32.0/mod.ts";
import { encodeHex } from "https://deno.land/std@0.210.0/encoding/hex.ts";

const jsCode = (
  await bundle(new URL("./client.tsx", import.meta.url), {
    compilerOptions: { jsxFactory: "h" },
  })
).code;

const jsHash = encodeHex(
  await crypto.subtle.digest("SHA-256", new TextEncoder().encode(jsCode))
);

await Deno.writeTextFile(
  new URL("./dist.json", import.meta.url),
  JSON.stringify({
    jsCode,
    jsHash,
  })
);
