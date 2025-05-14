import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav
      style={{
        backgroundColor: "#f0f0f0",
        padding: "10px",
        display: "flex",
        gap: "20px",
      }}
    >
      <Link to="/">Home</Link>
      <Link to="/games">Games</Link>
      <Link to="/dashboard">Dashboard</Link>
    </nav>
  );
}
