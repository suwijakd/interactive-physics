import type { PropsWithChildren } from "react";
import type { AppView, LabPhase } from "./routes";

const urlByPhase: Record<LabPhase, string> = {
  mission: "learnphenom.com/lab/pendulum/mission",
  lab: "learnphenom.com/lab/pendulum/experiment",
  results: "learnphenom.com/lab/pendulum/results",
};

const urlByView: Record<AppView, string> = {
  dashboard: "learnphenom.com/dashboard",
  labs: "learnphenom.com/labs",
  quests: "learnphenom.com/quests",
  notebook: "learnphenom.com/notebook",
  badges: "learnphenom.com/badges",
  pendulum: urlByPhase.mission,
};

const navItems: Array<{ view: AppView; label: string }> = [
  { view: "dashboard", label: "Dashboard" },
  { view: "labs", label: "Labs" },
  { view: "quests", label: "Quests" },
  { view: "notebook", label: "Notebook" },
  { view: "badges", label: "Badges" },
];

export function AppShell({
  children,
  currentView,
  activeView,
  phase,
  onNavigate,
}: PropsWithChildren<{ currentView: AppView; activeView: AppView; phase: LabPhase; onNavigate: (view: AppView) => void }>) {
  const address = currentView === "pendulum" ? urlByPhase[phase] : urlByView[currentView];

  return (
    <main className="app" aria-label="LearnPhenom interactive physics platform">
      <div className="browser-bar" aria-hidden="true">
        <div className="traffic">
          <span />
          <span />
          <span />
        </div>
        <div className="address">{address}</div>
        <div className="browser-menu">
          <span />
          <span />
          <span />
        </div>
      </div>

      <header className="top-nav">
        <button className="brand brand-button" type="button" onClick={() => onNavigate("dashboard")}>
          <div className="brand-mark" aria-hidden="true">
            <div className="brand-core">LP</div>
          </div>
          <div>
            <h1>LearnPhenom</h1>
            <p>Discover. Explore. Understand.</p>
          </div>
        </button>

        <nav className="nav-links" aria-label="Primary">
          {navItems.map((item) => (
            <button
              key={item.view}
              type="button"
              className={activeView === item.view ? "active" : ""}
              aria-current={activeView === item.view ? "page" : undefined}
              onClick={() => onNavigate(item.view)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="profile">
          <div className="xp">! 850</div>
          <div className="avatar" aria-hidden="true">
            A
          </div>
          <div className="greeting">
            Hi, Alex!
            <small>Grade 8</small>
          </div>
        </div>
      </header>

      {children}
    </main>
  );
}
