import { useState, useMemo } from "react";
import ShapeSortTile from "./ShapeSortTile";
import "../style/ShapeSortGrid.css";

const SHAPES = ["circle", "triangle", "square"] as const;
const COLORS = ["red", "blue", "yellow"] as const;

type Shape = (typeof SHAPES)[number];
type Color = (typeof COLORS)[number];

interface Tile {
  shape: Shape;
  color: Color;
  id: string;
}

function createTileSet(): Tile[] {
  const base: Tile[] = SHAPES.map((shape, index) => ({
    shape,
    color: COLORS[index % COLORS.length],
    id: `${shape}-${index}`,
  }));

  const remaining = 6 - base.length;
  for (let i = 0; i < remaining; i++) {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    base.push({ shape, color, id: `${shape}-${base.length}` });
  }

  return base;
}

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function ShapeSortGrid() {
  const expectedOrder = useMemo(() => createTileSet(), []);
  const [tiles, setTiles] = useState<Tile[]>(() => shuffle(expectedOrder));
  const [isWin, setIsWin] = useState(false);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    if (isWin) return;
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    if (isWin) return;

    const draggedId = e.dataTransfer.getData("text/plain");
    const draggedTile = tiles.find((t) => t.id === draggedId);
    if (!draggedTile) return;

    const updatedTiles = [...tiles];
    const fromIndex = updatedTiles.findIndex((t) => t.id === draggedId);
    updatedTiles.splice(fromIndex, 1);
    updatedTiles.splice(dropIndex, 0, draggedTile);

    setTiles(updatedTiles);

    // Check for win
    const didWin = updatedTiles.every((tile, i) => {
      const target = expectedOrder[i];
      return tile.shape === target.shape && tile.color === target.color;
    });

    if (didWin) {
      setIsWin(true);
    }
  };

  return (
    <div className="shape-sort-wrapper">
      <h2>The expected order of shapes is:</h2>
      <div className="expected-order">
        {expectedOrder.map((tile) => (
          <div
            key={tile.id}
            className={`preview ${tile.shape} ${tile.color}`}
          ></div>
        ))}
      </div>
      <div className="grid-zone">
        {tiles.map((tile, index) => (
          <div
            key={tile.id}
            className="dropzone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, index)}
          >
            <ShapeSortTile {...tile} onDragStart={handleDragStart} />
          </div>
        ))}
      </div>
      {isWin && (
        <h2 style={{ textAlign: "center", marginTop: "20px", color: "green" }}>
          🎉 You Win!
        </h2>
      )}
    </div>
  );
}
