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

interface Tile {
  id: number;
  color: "red" | "blue" | "yellow";
  isRevealed: boolean;
  isMatched: boolean;
}

export default function ColorMatchGrid() {
  const [tiles, setTiles] = useState<Tile[]>(
    generateColorPairs().map((color, index) => ({
      id: index,
      color,
      isRevealed: false,
      isMatched: false,
    }))
  );
  const [revealedIndexes, setRevealedIndexes] = useState<number[]>([]);
  const [isBusy, setIsBusy] = useState(false);

  const handleTileClick = (index: number) => {
    if (tiles[index].isMatched || tiles[index].isRevealed || isBusy) return;

    const newTiles = [...tiles];
    newTiles[index].isRevealed = true;
    setTiles(newTiles);

    if (revealedIndexes.length === 0) {
      setRevealedIndexes([index]);
    } else if (revealedIndexes.length === 1) {
      const firstIndex = revealedIndexes[0];
      const secondIndex = index;
      if (tiles[firstIndex].color === tiles[secondIndex].color) {
        // Match found
        newTiles[firstIndex].isMatched = true;
        newTiles[secondIndex].isMatched = true;
        setTiles([...newTiles]);
        setRevealedIndexes([]);
      } else {
        // No match - show both then hide
        setIsBusy(true);
        setTimeout(() => {
          newTiles[firstIndex].isRevealed = false;
          newTiles[secondIndex].isRevealed = false;
          setTiles([...newTiles]);
          setRevealedIndexes([]);
          setIsBusy(false);
        }, 2000);
      }
    }
  };

  return (
    <div className="grid">
      {tiles.map((tile, index) => (
        <ColorMatchTile
          key={tile.id}
          actualColor={tile.color}
          isRevealed={tile.isRevealed}
          isMatched={tile.isMatched}
          onClick={() => handleTileClick(index)}
        />
      ))}
    </div>
  );
}
