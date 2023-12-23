import { h } from "https://esm.sh/preact@10.19.3?pin=v135";
import { useState } from "https://esm.sh/preact@10.19.3/hooks?pin=v135";

export const App = (
  props: {
    readonly state: string | undefined;
    readonly onClick: (() => void) | undefined;
  },
) => {
  return (
    <div style="height: 100%;display: grid;justify-content: center;align-content: center;">
      {props.state === undefined
        ? (
          <button
            style="padding: 32px;font-size: 3rem;box-shadow: black 0px 1px 6px;border-radius: 8px;border: none;background: skyblue;cursor: pointer;"
            disabled={props.onClick === undefined}
            onClick={() => {
              props.onClick?.();
            }}
          >
            提出
          </button>
        )
        : (
          <div>
            {props.state.split("\n").map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </div>
        )}
    </div>
  );
};
