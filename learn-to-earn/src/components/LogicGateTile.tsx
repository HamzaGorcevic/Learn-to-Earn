import "../style/LogicGateTile.css";

interface LogicGateTileProps {
  type: "input" | "gate" | "output";
  gateType?: "AND" | "OR";
  inputValue?: boolean;
  computedOutput?: boolean;
  onToggle?: () => void;
}

export default function LogicGateTile({
  type,
  gateType,
  inputValue,
  computedOutput,
  onToggle,
}: LogicGateTileProps) {
  let label = "";
  let active = false;

  if (type === "input") {
    label = inputValue ? "ON" : "OFF";
    active = !!inputValue;
  } else if (type === "gate") {
    label = gateType || "?";
  } else if (type === "output") {
    label = computedOutput ? "✅" : "❌";
    active = !!computedOutput;
  }

  return (
    <div
      className={`logic-tile ${type} ${active ? "active" : ""}`}
      onClick={type === "input" && onToggle ? onToggle : undefined}
    >
      {label}
    </div>
  );
}
