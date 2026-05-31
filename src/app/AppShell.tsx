import type { PropsWithChildren } from "react";
import type { LabPhase } from "./routes";

const urlByPhase: Record<LabPhase, string> = {
  mission: "learnphenom.com/lab/pendulum/mission",
  lab: "learnphenom.com/lab/pendulum/experiment",
  results: "learnphenom.com/lab/pendulum/results",
};

export function AppShell({ children, phase }: PropsWithChildren<{ phase: LabPhase }>) {
  return (
    <main className="app" aria-label="LearnPhenom interactive physics platform">
      <div className="browser-bar" aria-hidden="true">
        <div className="traffic">
          <span />
          <span />
          <span />
        </div>
        <div className="address">{urlByPhase[phase]}</div>
        <div className="browser-menu">
          <span />
          <span />
          <span />
        </div>
      </div>

      <header className="top-nav">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <div className="brand-core">LP</div>
          </div>
          <div>
            <h1>LearnPhenom</h1>
            <p>Discover. Explore. Understand.</p>
          </div>
        </div>

        <nav className="nav-links" aria-label="Primary">
          <span>Dashboard</span>
          <span className="active">Labs</span>
          <span>Quests</span>
          <span>Notebook</span>
          <span>Badges</span>
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
