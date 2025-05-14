import "../style/Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <section>
        <h2>Child Progress</h2>
        <ul>
          <li>✅ Color Match Game - Completed</li>
          <li>🔲 Shape Sorting Game - Not Started</li>
          <li>🔲 Logic Gate Puzzle - Not Started</li>
        </ul>
      </section>

      <section>
        <h2>Earned Starpoints</h2>
        <p>
          <strong>120 Starpoints</strong>
        </p>
      </section>

      <section>
        <h2>Badges</h2>
        <p>🏅 Beginner Learner</p>
      </section>

      <section>
        <h2>Actions</h2>
        <button>🎁 Redeem Rewards</button>
      </section>
    </div>
  );
}
