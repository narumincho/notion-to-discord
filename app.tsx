import { h } from "https://esm.sh/preact@10.19.3?pin=v135";
import { useState } from "https://esm.sh/preact@10.19.3/hooks?pin=v135";

export const App = () => {
  const [state, setState] = useState<string | undefined>(undefined);
  return (
    <div style="height: 100%;display: grid;justify-content: center;align-content: center;">
      {state === undefined
        ? (
          <button
            style="padding: 32px;font-size: 3rem;box-shadow: black 0px 1px 6px;border-radius: 8px;border: none;background: skyblue;cursor: pointer;"
            onClick={() => {
              submit(setState);
            }}
          >
            提出
          </button>
        )
        : <div>{state}</div>}
    </div>
  );
};

const submit = async (
  stateUpdater: (func: (prev: string | undefined) => string) => void,
) => {
  const response = await fetch("/submit", {
    method: "POST",
  });
  response.body?.pipeTo(
    new WritableStream({
      write: (chunk) => {
        const decoder = new TextDecoder();
        const text = decoder.decode(chunk);
        stateUpdater((prev) => prev + text);
      },
    }),
  );
};
