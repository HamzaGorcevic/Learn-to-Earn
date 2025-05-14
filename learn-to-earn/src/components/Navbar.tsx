import { Link } from "react-router-dom";
import "../style/Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/games">Games</Link>
      <Link to="/dashboard">Dashboard</Link>
    </nav>
  );
}
