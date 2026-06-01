import type { AppView } from "./routes";

type ProductViewProps = {
  view: Exclude<AppView, "pendulum">;
  onOpenPendulum: () => void;
};

const placeholderCopy = {
  quests: {
    title: "Quests",
    eyebrow: "Coming Soon",
    body: "Guided challenge paths will connect labs into bigger science missions. Pendulum Basics is the first quest being shaped here.",
    action: "Start Pendulum Basics",
  },
  notebook: {
    title: "Notebook",
    eyebrow: "Student Workspace",
    body: "This will collect observations, screenshots, trial notes, and teacher prompts. For now, experiment results live inside each lab.",
    action: "Collect Pendulum Data",
  },
  badges: {
    title: "Badges",
    eyebrow: "Progress & Rewards",
    body: "Students will earn badges for predictions, careful data collection, and explaining patterns. The pendulum lab already unlocks Data Detective.",
    action: "Earn a Badge",
  },
} satisfies Record<"quests" | "notebook" | "badges", { title: string; eyebrow: string; body: string; action: string }>;

export function ProductView({ view, onOpenPendulum }: ProductViewProps) {
  if (view === "dashboard") return <DashboardView onOpenPendulum={onOpenPendulum} />;
  if (view === "labs") return <LabsCatalog onOpenPendulum={onOpenPendulum} />;
  return <PlaceholderView {...placeholderCopy[view]} onOpenPendulum={onOpenPendulum} />;
}

function DashboardView({ onOpenPendulum }: { onOpenPendulum: () => void }) {
  return (
    <section className="product-page" aria-labelledby="dashboard-title">
      <div className="product-hero">
        <span className="eyebrow">Student Dashboard</span>
        <h2 id="dashboard-title">Ready for today's physics mission?</h2>
        <p>Pick up the pendulum lab, collect real runs, and unlock your first data badge.</p>
        <button className="button green" type="button" onClick={onOpenPendulum}>
          Continue Pendulum Lab
        </button>
      </div>

      <div className="product-grid">
        <article className="product-card highlight">
          <span className="product-icon">L</span>
          <h3>Current Lab</h3>
          <p>Simple pendulum without friction</p>
          <button className="button purple small" type="button" onClick={onOpenPendulum}>
            Open Lab
          </button>
        </article>
        <article className="product-card">
          <span className="product-icon">Q</span>
          <h3>Quest Progress</h3>
          <p>Pendulum Basics is in progress. Complete experiments to fill your notebook.</p>
        </article>
        <article className="product-card">
          <span className="product-icon">D</span>
          <h3>Next Badge</h3>
          <p>Record at least one real run to start earning Data Detective.</p>
        </article>
      </div>
    </section>
  );
}

function LabsCatalog({ onOpenPendulum }: { onOpenPendulum: () => void }) {
  return (
    <section className="product-page" aria-labelledby="labs-title">
      <div className="product-hero compact-product">
        <span className="eyebrow">Physics Labs</span>
        <h2 id="labs-title">Choose a lab to explore</h2>
        <p>Each lab follows the same product rhythm: mission briefing, live experiment, results and reflection.</p>
      </div>

      <div className="lab-catalog">
        <article className="lab-catalog-card available">
          <span className="product-icon">P</span>
          <div>
            <h3>Simple Pendulum</h3>
            <p>Explore length, mass, initial angle, and angular velocity with a no-friction simulation.</p>
          </div>
          <button className="button green small" type="button" onClick={onOpenPendulum}>
            Open
          </button>
        </article>
        {["Damping & Friction", "Forces & Motion", "Waves"].map((title) => (
          <article className="lab-catalog-card locked" key={title} aria-disabled="true">
            <span className="product-icon muted-icon">Soon</span>
            <div>
              <h3>{title}</h3>
              <p>This lab is planned for a future release.</p>
            </div>
            <span className="coming-soon">Coming soon</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function PlaceholderView({
  title,
  eyebrow,
  body,
  action,
  onOpenPendulum,
}: {
  title: string;
  eyebrow: string;
  body: string;
  action: string;
  onOpenPendulum: () => void;
}) {
  return (
    <section className="product-page" aria-labelledby={`${title.toLowerCase()}-title`}>
      <div className="product-hero">
        <span className="eyebrow">{eyebrow}</span>
        <h2 id={`${title.toLowerCase()}-title`}>{title}</h2>
        <p>{body}</p>
        <button className="button green" type="button" onClick={onOpenPendulum}>
          {action}
        </button>
      </div>
      <div className="product-grid single">
        <article className="product-card empty-state">
          <span className="product-icon">...</span>
          <h3>More product tools are on the way</h3>
          <p>This page is intentionally navigable so students never hit a dead tab while the platform grows.</p>
        </article>
      </div>
    </section>
  );
}
