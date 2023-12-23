import { h, render } from "https://esm.sh/preact@10.19.3?pin=v135";
import { App } from "./app.tsx";
import { useState } from "https://esm.sh/preact@10.19.3/hooks?pin=v135";

const main = () => {
  const rootElement = document.getElementById("root");

  if (rootElement === null) {
    document.body.append("エラー: id が root の Element を見つけられなかった");
  } else {
    render(
      <AppWithState />,
      rootElement,
    );
  }
};

const AppWithState = () => {
  const [state, setState] = useState<string | undefined>(undefined);

  return (
    <App
      state={state}
      onClick={() => {
        submit(setState);
      }}
    />
  );
};

const submit = async (
  stateUpdater: (func: (prev: string | undefined) => string) => void,
): Promise<void> => {
  const response = await fetch("/submit", {
    method: "POST",
  });
  response.body?.pipeTo(
    new WritableStream({
      write: (chunk) => {
        const decoder = new TextDecoder();
        const text = decoder.decode(chunk);
        stateUpdater((prev) => prev === undefined ? text : prev + text);
      },
    }),
  );
};

main();
