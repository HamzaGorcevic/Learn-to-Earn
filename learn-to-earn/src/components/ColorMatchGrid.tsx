import { useState } from "react";
import ColorMatchTile from "./ColorMatchTile";
import "../style/ColorMatchGrid.css";

const COLORS: Array<"red" | "blue" | "yellow"> = ["red", "blue", "yellow"];

const generateColorPairs = (): Array<"red" | "blue" | "yellow"> => {
  const pairs: Array<"red" | "blue" | "yellow"> = [];
  COLORS.forEach((color) => {
    for (let i = 0; i < 4; i++) pairs.push(color);
  });
  return pairs.sort(() => Math.random() - 0.5);
};

export default function ColorMatchGrid() {
  const [tiles, setTiles] = useState(
    generateColorPairs().map((color, index) => ({
      id: index,
      color,
      isRevealed: false,
    }))
  );

  const handleTileClick = (index: number) => {
    setTiles((prev) =>
      prev.map((tile, i) =>
        i === index ? { ...tile, isRevealed: true } : tile
      )
    );
  };

  return (
    <div className="grid">
      {tiles.map((tile, index) => (
        <ColorMatchTile
          key={tile.id}
          actualColor={tile.color as "red" | "blue" | "yellow"}
          isRevealed={tile.isRevealed}
          onClick={() => handleTileClick(index)}
        />
      ))}
    </div>
  );
}
