import "../style/ColorMatch.css";
import ColorMatchGrid from "../components/ColorMatchGrid";

export default function ColorMatch() {
  return (
    <div className="game-page">
      <h1>🎨 Color Match Game</h1>
      <ColorMatchGrid />
    </div>
  );
}
