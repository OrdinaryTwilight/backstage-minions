import { useEffect, useMemo, useState } from "react";

export function useKeyPress(targetKeys: string | string[]) {
  const [keyPressed, setKeyPressed] = useState(false);

  // Memoize the normalized keys array to maintain referential equality
  const keys = useMemo(
    () => (Array.isArray(targetKeys) ? targetKeys : [targetKeys]),
    [targetKeys],
  );

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
  }, [keys]);

  return keyPressed;
}
