import { useEffect, useState } from "react";

export function useKeyPress(targetKeys: string[]): boolean {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const downHandler = (e: KeyboardEvent) => {
      if (targetKeys.includes(e.key)) {
        setKeyPressed(true);
      }
    };

    const upHandler = (e: KeyboardEvent) => {
      if (targetKeys.includes(e.key)) {
        setKeyPressed(false);
      }
    };

    const resetHandler = () => {
      setKeyPressed(false);
    };

    globalThis.addEventListener("keydown", downHandler);
    globalThis.addEventListener("keyup", upHandler);
    globalThis.addEventListener("blur", resetHandler);

    return () => {
      globalThis.removeEventListener("keydown", downHandler);
      globalThis.removeEventListener("keyup", upHandler);
      globalThis.removeEventListener("blur", resetHandler);
    };
  }, [targetKeys]);

  return keyPressed;
}
