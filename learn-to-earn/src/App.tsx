import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Games from "./pages/Games";
import Dashboard from "./pages/Dashboard";
import ColorMatch from "./pages/ColorMatch";
import ShapeSort from "./pages/ShapeSort";
import LogicGate from "./pages/LogicGate";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<Games />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/games/color-match" element={<ColorMatch />} />
        <Route path="/games/shape-sort" element={<ShapeSort />} />
        <Route path="/games/logic-gate" element={<LogicGate />} />
      </Routes>
    </Router>
  );
}
