import { useScrollProgress } from "../hooks/useScrollProgress";
import { useActiveSection } from "../hooks/useActiveSection";
import "./RouteRail.css";

const WAYPOINTS = [
  { id: "top", label: "Start" },
  { id: "about", label: "About" },
  { id: "network", label: "Connect" },
  { id: "showcase", label: "Showcase" },
  { id: "download", label: "Download" },
  { id: "team", label: "Team" },
];

export function RouteRail() {
  const progress = useScrollProgress();
  const active = useActiveSection(WAYPOINTS.map((w) => w.id));

  return (
    <aside className="route-rail" aria-label="Page sections">
      <div className="route-track">
        <div
          className="route-fill"
          style={{ height: `${progress * 100}%` }}
        />
      </div>
      <ul>
        {WAYPOINTS.map((point) => (
          <li key={point.id}>
            <a
              href={`#${point.id}`}
              className={active === point.id ? "is-active" : ""}
            >
              <span className="route-dot" />
              <span className="route-label">{point.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
