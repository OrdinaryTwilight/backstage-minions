import { useGame } from "../../../context/GameContext";
import { CHARACTERS } from "../../../data/gameData";

export function useEquipment(onComplete: () => void) {
  const { state, dispatch } = useGame();
  const char = CHARACTERS.find((c) => c.id === state.session?.characterId);

  function handleSelect(pkgId: string) {
    dispatch({ type: "SET_GEAR", gearId: pkgId });
    onComplete();
  }

  return { char, handleSelect };
}
