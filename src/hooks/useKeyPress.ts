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

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [targetKeys]);

  return keyPressed;
}
