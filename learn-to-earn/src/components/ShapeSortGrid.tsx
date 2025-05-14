import { useState } from "react";
import ShapeSortTile from "./ShapeSortTile";
import "../style/ShapeSortGrid.css";

const SHAPES = ["circle", "triangle", "square"] as const;
const COLORS = ["red", "blue", "yellow"] as const;

function generateTiles() {
  const tiles = SHAPES.map((shape, index) => ({
    shape,
    color: COLORS[index % COLORS.length],
    id: `${shape}-${index}`,
  }));
  const remaining = 6 - tiles.length;
  for (let i = 0; i < remaining; i++) {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    tiles.push({ shape, color, id: `${shape}-${tiles.length}` });
  }
  return tiles.sort(() => Math.random() - 0.5);
}

const expectedOrder = generateTiles();

export default function ShapeSortGrid() {
  const [tiles, setTiles] = useState(generateTiles());

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    const draggedId = e.dataTransfer.getData("text/plain");
    const draggedTile = tiles.find((t) => t.id === draggedId);
    if (!draggedTile) return;

    const updatedTiles = [...tiles];
    const fromIndex = updatedTiles.findIndex((t) => t.id === draggedId);
    const toIndex = dropIndex;
    updatedTiles.splice(fromIndex, 1);
    updatedTiles.splice(toIndex, 0, draggedTile);

    setTiles(updatedTiles);
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
    </div>
  );
}
