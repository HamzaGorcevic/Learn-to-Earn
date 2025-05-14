import "../style/ShapeSortTile.css";

interface ShapeSortTileProps {
  shape: "circle" | "triangle" | "square";
  color: "red" | "blue" | "yellow";
  id: string;
  onDragStart: (event: React.DragEvent<HTMLDivElement>, id: string) => void;
}

export default function ShapeSortTile({
  shape,
  color,
  id,
  onDragStart,
}: ShapeSortTileProps) {
  return (
    <div
      className={`shape-tile ${shape} ${color}`}
      draggable
      onDragStart={(e) => onDragStart(e, id)}
    ></div>
  );
}
