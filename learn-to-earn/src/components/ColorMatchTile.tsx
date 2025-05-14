import { useState, useEffect } from "react";
import "../style/ColorMatchTile.css";

type ColorType = "red" | "blue" | "yellow" | "unknown";

interface ColorMatchTileProps {
  actualColor: Exclude<ColorType, "unknown">;
  isRevealed: boolean;
  isMatched: boolean;
  onClick: () => void;
}

export default function ColorMatchTile({
  actualColor,
  isRevealed,
  isMatched,
  onClick,
}: ColorMatchTileProps) {
  const [displayColor, setDisplayColor] = useState<ColorType>("unknown");

  useEffect(() => {
    if (isMatched || isRevealed) {
      setDisplayColor(actualColor);
    } else {
      setDisplayColor("unknown");
    }
  }, [isRevealed, isMatched, actualColor]);

  return <div className={`tile ${displayColor}`} onClick={onClick}></div>;
}
