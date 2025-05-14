import { useNavigate } from "react-router-dom";
import "../style/Games.css";

export default function Games() {
  const navigate = useNavigate();

  return (
    <div className="games">
      <h1>Select a Game</h1>
      <ul>
        <li>
          <button onClick={() => navigate("/games/color-match")}>
            🎨 Color Match Game
          </button>
        </li>
        <li>
          <button onClick={() => navigate("/games/shape-sort")}>
            🔺 Shape Sorting Game
          </button>
        </li>
        <li>
          <button onClick={() => navigate("/games/logic-gate")}>
            🔌 Logic Gate Puzzle
          </button>
        </li>
      </ul>
      <p>Earn Starpoints for each successfully completed game!</p>
    </div>
  );
}
