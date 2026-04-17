import { useEffect, useState } from 'react';

export function useKeyPress(targetKey: string) {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const downHandler = ({ key }: KeyboardEvent) => {
      if (key.toLowerCase() === targetKey.toLowerCase()) setKeyPressed(true);
    };
    const upHandler = ({ key }: KeyboardEvent) => {
      if (key.toLowerCase() === targetKey.toLowerCase()) setKeyPressed(false);
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey]);

  return keyPressed;
}