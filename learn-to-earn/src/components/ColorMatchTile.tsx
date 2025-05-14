import { useState, useEffect } from "react";
import "../style/ColorMatchTile.css";

type ColorType = "red" | "blue" | "yellow" | "unknown";

interface ColorMatchTileProps {
  actualColor: Exclude<ColorType, "unknown">;
  isRevealed: boolean;
  onClick: () => void;
}

export default function ColorMatchTile({
  actualColor,
  isRevealed,
  onClick,
}: ColorMatchTileProps) {
  const [displayColor, setDisplayColor] = useState<ColorType>("unknown");

  useEffect(() => {
    if (isRevealed) {
      setDisplayColor(actualColor);
      const timer = setTimeout(() => {
        setDisplayColor("unknown");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isRevealed, actualColor]);

  return <div className={`tile ${displayColor}`} onClick={onClick}></div>;
}
