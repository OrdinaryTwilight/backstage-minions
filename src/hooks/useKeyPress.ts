import { useEffect, useState } from "react";

export function useKeyPress(targetKeys: string | string[]) {
  const [keyPressed, setKeyPressed] = useState(false);

  // Normalize to an array
  const keys = Array.isArray(targetKeys) ? targetKeys : [targetKeys];

  useEffect(() => {
    const downHandler = ({ key }: KeyboardEvent) => {
      if (keys.map((k) => k.toLowerCase()).includes(key.toLowerCase()))
        setKeyPressed(true);
    };
    const upHandler = ({ key }: KeyboardEvent) => {
      if (keys.map((k) => k.toLowerCase()).includes(key.toLowerCase()))
        setKeyPressed(false);
    };

    globalThis.addEventListener("keydown", downHandler);
    globalThis.addEventListener("keyup", upHandler);

    return () => {
      globalThis.removeEventListener("keydown", downHandler);
      globalThis.removeEventListener("keyup", upHandler);
    };
  }, [targetKeys]);

  return keyPressed;
}
