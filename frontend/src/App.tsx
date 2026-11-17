
import { useState } from "react";
import "./App.css";

// FAKE DATA — replace with Supabase readings later
const plant = {
  name: "Tomato Plant",
  species: "Solanum lycopersicum",
  stage: "Vegetative Stage",
  moisture: 42,
  temperature: 24,
  humidity: 61,
  lightScore: 80,
  temperatureScore: 75,
};

const healthBars = [
  {
    label: "Soil Moisture",
    value: `${plant.moisture}%`,
    percent: plant.moisture,
    color: "#75a9dd",
  },
  {
    label: "Temperature",
    value: `${plant.temperature}°C`,
    percent: plant.temperatureScore,
    color: "#e5ad71",
  },
  {
    label: "Humidity",
    value: `${plant.humidity}%`,
    percent: plant.humidity,
    color: "#81b9a4",
  },
  {
    label: "Light",
    value: "Good",
    percent: plant.lightScore,
    color: "#e4c76e",
  },
];

function PlantIllustration() {
  return (
    <svg
      className="plant-illustration"
      viewBox="0 0 240 240"
      role="img"
      aria-label="Illustration of a healthy green plant in a pot"
    >
      <circle cx="120" cy="112" r="98" fill="#edf4e8" />

      {/* Stems */}
      <g stroke="#467c52" strokeWidth="5" fill="none"
         strokeLinecap="round">
        <path d="M120 183 V65" />
        <path d="M120 139 Q86 100 63 94" />
        <path d="M120 152 Q160 111 178 96" />
        <path d="M120 109 Q145 79 145 58" />
      </g>

      {/* Leaves */}
      <g fill="#78a96c">
        <ellipse cx="100" cy="65" rx="20" ry="35"
          transform="rotate(-35 100 65)" />
        <ellipse cx="148" cy="60" rx="19" ry="32"
          transform="rotate(30 148 60)" />
        <ellipse cx="66" cy="94" rx="28" ry="16"
          transform="rotate(25 66 94)" />
        <ellipse cx="177" cy="96" rx="29" ry="17"
          transform="rotate(-25 177 96)" />
        <ellipse cx="91" cy="130" rx="25" ry="16"
          transform="rotate(30 91 130)" />
        <ellipse cx="153" cy="135" rx="25" ry="16"
          transform="rotate(-30 153 135)" />
      </g>

      <g fill="#a4c897">
        <ellipse cx="97" cy="68" rx="8" ry="20"
          transform="rotate(-35 97 68)" />
        <ellipse cx="146" cy="63" rx="8" ry="19"
          transform="rotate(30 146 63)" />
      </g>

      {/* Pot */}
      <path
        d="M78 172 H162 L151 218 H89 Z"
        fill="#d99b78"
      />
      <rect x="74" y="166" width="92" height="16"
        rx="6" fill="#bd7856" />
      <path d="M90 218 H150" stroke="#b97959"
        strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const needsWaterSoon = plant.moisture < 45;

  const menuItems = [
    "Home",
    "Plant Health History",
    "Plant Insights",
    "Profile",
  ];

  function handleMenuClick(item: string) {
    setMenuOpen(false);

    if (item === "Home") {
      setNotice("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setNotice(`${item} page coming soon!`);
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <div className="brand-name">ROOTCAUSE</div>
          <h1>My Garden</h1>
        </div>

        <div className="menu-container">
          <button
            className="menu-button"
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            aria-controls="main-menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="menu-lines">
              <span />
              <span />
              <span />
            </span>
          </button>

          {menuOpen && (
            <nav className="dropdown-menu" id="main-menu">
              {menuItems.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleMenuClick(item)}
                >
                  {item}
                </button>
              ))}
            </nav>
          )}
        </div>
      </header>

      {notice && (
        <div className="notice" role="status">
          {notice}
          <button
            onClick={() => setNotice("")}
            aria-label="Dismiss message"
            type="button"
          >
            ×
          </button>
        </div>
      )}

      <section className="health-section">
        <div className="section-heading">
          <h2>Plant Health</h2>
          <span className="status-badge">Demo data</span>
        </div>

        <div className="health-bars">
          {healthBars.map((bar) => (
            <div className="health-item" key={bar.label}>
              <div className="health-label">
                <span>{bar.label}</span>
                <span>{bar.value}</span>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${bar.percent}%`,
                    backgroundColor: bar.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="plant-section">
        <div className="plant-image-container">
          <PlantIllustration />
        </div>

        <h2>{plant.name}</h2>
        <p className="species">{plant.species}</p>
        <span className="stage-badge">{plant.stage}</span>
      </section>

      <section className="tasks-section">
        <div className="section-heading">
          <h2>Upcoming Tasks</h2>
          <span className="task-count">
            {needsWaterSoon ? "1 reminder" : "All clear"}
          </span>
        </div>

        {needsWaterSoon ? (
          <div className="task-card">
            <div className="task-icon">💧</div>
            <div className="task-content">
              <h3>Check soil moisture soon</h3>
              <p>
                Your soil moisture is currently at{" "}
                {plant.moisture}% and approaching the
                demo watering threshold. Check your
                plant soon to see if it needs water.
              </p>
              <span className="task-tag">
                Upcoming care reminder
              </span>
            </div>
          </div>
        ) : (
          <div className="task-card">
            <div className="task-icon">🌱</div>
            <div className="task-content">
              <h3>You're all caught up!</h3>
              <p>
                No watering reminders based on the
                current demo moisture threshold.
              </p>
            </div>
          </div>
        )}
      </section>

      <footer className="app-footer">
        RootCause • Plant care made simple
      </footer>
    </div>
  );
}
