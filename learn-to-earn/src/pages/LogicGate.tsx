import "../style/LogicGate.css";
import LogicGateGrid from "../components/LogicGateGrid";

export default function LogicGate() {
  return (
    <div className="game-page">
      <h1>🔌 Logic Gate Puzzle</h1>
      <LogicGateGrid />
    </div>
  );
}
