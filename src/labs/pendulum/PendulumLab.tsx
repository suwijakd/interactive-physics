import { useEffect, useRef, useState } from "react";
import type { LabPhase } from "../../app/routes";
import { phaseIndex } from "../../app/routes";
import { BadgeMedal } from "../../components/badges/BadgeMedal";
import { CanvasSurface } from "../../components/canvas/CanvasSurface";
import { RangeControl } from "../../components/controls/RangeControl";
import { Panel } from "../../components/layout/Panel";
import { pendulumLab, type PendulumRun, type PendulumSettings } from "./pendulumContent";
import { smallAnglePeriod } from "./physics";
import { drawPendulum, drawReplay } from "./renderPendulum";
import { createResultsGraphPoints, drawTimeGraph, liveGraphSeries, resultsGraphSeries } from "./renderGraphs";
import { usePendulumSimulation } from "./usePendulumSimulation";

type PendulumLabProps = {
  phase: LabPhase;
  setPhase: (phase: LabPhase) => void;
};

const phaseProgress = {
  mission: 0,
  lab: 60,
  results: 100,
} satisfies Record<LabPhase, number>;

export function PendulumLab({ phase, setPhase }: PendulumLabProps) {
  const simulation = usePendulumSimulation();
  const pendulumCanvasRef = useRef<HTMLCanvasElement>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement>(null);
  const replayCanvasRef = useRef<HTMLCanvasElement>(null);
  const resultsGraphCanvasRef = useRef<HTMLCanvasElement>(null);
  const modalGraphCanvasRef = useRef<HTMLCanvasElement>(null);
  const modalResultsGraphCanvasRef = useRef<HTMLCanvasElement>(null);
  const [activeDialog, setActiveDialog] = useState<null | "intro" | "formula" | "liveGraph" | "resultsGraph">(null);
  const displayRuns = simulation.runs;
  const hasRuns = displayRuns.length > 0;

  useEffect(() => {
    if (pendulumCanvasRef.current) drawPendulum(pendulumCanvasRef.current, simulation.sample);
  }, [simulation.sample]);

  useEffect(() => {
    if (graphCanvasRef.current) {
      drawTimeGraph(graphCanvasRef.current, simulation.history, {
        yLabel: "Angle (rad)",
        xLabel: "Time (s)",
        windowSeconds: 12,
        series: liveGraphSeries,
      });
    }
  }, [simulation.history]);

  useEffect(() => {
    if (phase !== "results" || !hasRuns) return;
    if (replayCanvasRef.current) drawReplay(replayCanvasRef.current, displayRuns);
    if (resultsGraphCanvasRef.current) {
      drawTimeGraph(resultsGraphCanvasRef.current, createResultsGraphPoints(displayRuns), {
        yLabel: "Angle (rad)",
        xLabel: "Time (s)",
        windowSeconds: 12,
        series: resultsGraphSeries,
      });
    }
  }, [phase, displayRuns, hasRuns]);

  useEffect(() => {
    if (activeDialog === "liveGraph" && modalGraphCanvasRef.current) {
      drawTimeGraph(modalGraphCanvasRef.current, simulation.history, {
        yLabel: "Angle (rad)",
        xLabel: "Time (s)",
        windowSeconds: 12,
        series: liveGraphSeries,
      });
    }
    if (activeDialog === "resultsGraph" && modalResultsGraphCanvasRef.current && hasRuns) {
      drawTimeGraph(modalResultsGraphCanvasRef.current, createResultsGraphPoints(displayRuns), {
        yLabel: "Angle (rad)",
        xLabel: "Time (s)",
        windowSeconds: 12,
        series: resultsGraphSeries,
      });
    }
  }, [activeDialog, displayRuns, hasRuns, simulation.history]);

  useEffect(() => {
    const handleResize = () => {
      if (pendulumCanvasRef.current) drawPendulum(pendulumCanvasRef.current, simulation.sample);
      if (graphCanvasRef.current) {
        drawTimeGraph(graphCanvasRef.current, simulation.history, {
          yLabel: "Angle (rad)",
          xLabel: "Time (s)",
          windowSeconds: 12,
          series: liveGraphSeries,
        });
      }
      if (phase === "results" && hasRuns) {
        if (replayCanvasRef.current) drawReplay(replayCanvasRef.current, displayRuns);
        if (resultsGraphCanvasRef.current) {
          drawTimeGraph(resultsGraphCanvasRef.current, createResultsGraphPoints(displayRuns), {
            yLabel: "Angle (rad)",
            xLabel: "Time (s)",
            windowSeconds: 12,
            series: resultsGraphSeries,
          });
        }
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [displayRuns, hasRuns, phase, simulation.history, simulation.sample]);

  return (
    <>
      {phase === "mission" && <MissionPhase setPhase={setPhase} onOpenDialog={setActiveDialog} />}
      {phase === "lab" && (
        <LabPhaseView
          simulation={simulation}
          pendulumCanvasRef={pendulumCanvasRef}
          graphCanvasRef={graphCanvasRef}
          setPhase={setPhase}
          onOpenDialog={setActiveDialog}
        />
      )}
      {phase === "results" && (
        <ResultsPhase
          displayRuns={displayRuns}
          hasRuns={hasRuns}
          replayCanvasRef={replayCanvasRef}
          resultsGraphCanvasRef={resultsGraphCanvasRef}
          setPhase={setPhase}
          onOpenDialog={setActiveDialog}
        />
      )}
      <DialogHost
        activeDialog={activeDialog}
        onClose={() => setActiveDialog(null)}
        modalGraphCanvasRef={modalGraphCanvasRef}
        modalResultsGraphCanvasRef={modalResultsGraphCanvasRef}
        hasRuns={hasRuns}
      />
      <footer className="footer-ribbon">
        Curious minds swing farther. Let's <b>explore the science</b> behind every swing!
      </footer>
      <nav className="phase-switcher" aria-label="Mobile phase switcher">
        {(["mission", "lab", "results"] as const).map((item) => (
          <button
            key={item}
            className={phase === item ? "active" : ""}
            disabled={item === "results" && !hasRuns}
            aria-current={phase === item ? "page" : undefined}
            onClick={() => setPhase(item)}
          >
            {pendulumLab.phaseLabels[item]}
          </button>
        ))}
      </nav>
    </>
  );
}

function MissionPhase({
  setPhase,
  onOpenDialog,
}: {
  setPhase: (phase: LabPhase) => void;
  onOpenDialog: (dialog: "intro") => void;
}) {
  return (
    <section aria-labelledby="mission-title">
      <div className="space-hero mission-hero">
        <div className="hero-pendulum" aria-hidden="true">
          <div className="pivot" />
          <div className="arc" />
          <div className="arm">
            <div className="bob" />
          </div>
        </div>
        <div className="speech">
          Make a <span className="accent-gold">prediction</span> before you swing.
        </div>

        <div className="phase-hero">
          <div>
            <span className="eyebrow">Physics Lab - Mission 1 of 3</span>
            <h2 className="hero-title" id="mission-title">
              {pendulumLab.missionTitle}
            </h2>
            <p className="hero-copy">
              <span className="accent-gold">Predict, test, and discover</span> what controls a pendulum's swing. Change the
              settings, run the experiment, and see how the pendulum behaves.
            </p>
            <div className="hero-actions">
              <button className="button green" onClick={() => setPhase("lab")}>
                Start Lab
              </button>
              <button className="button outline" type="button" onClick={() => onOpenDialog("intro")}>
                Watch Intro 2:12 min
              </button>
            </div>
          </div>

          <aside className="glass-panel phase-card progress-card">
            <h3>Mission Progress</h3>
            <p>
              <strong>Phase 1 of 3</strong>
            </p>
            <ProgressBar value={phaseProgress.mission} />
            <p>Get ready to run your first experiment!</p>
            <h3 className="section-title light">Badges You Can Earn</h3>
            <div className="badge-row">
              {pendulumLab.badges.map((badge) => (
                <div className="badge" key={badge.id}>
                  <BadgeMedal label={badge.mark} tone={badge.tone} />
                  <strong>{badge.label}</strong>
                  <small>{badge.description}</small>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>

      <div className="content-pad">
        <div className="mission-grid">
          <Panel className="discover-panel">
            <h3 className="section-title light">What You'll Discover</h3>
            <div className="learn-cards">
              {pendulumLab.learningGoals.map((goal, index) => (
                <article className="learn-card" key={goal.id}>
                  <div className="round-icon">{goal.icon}</div>
                  <h3>{goal.title}</h3>
                  <p>{goal.body}</p>
                  <div className="number-chip">{index + 1}</div>
                </article>
              ))}
            </div>
          </Panel>

          <Panel className="challenge-card">
            <h3 className="section-title light">Your First Challenge</h3>
            <h2>
              First Mission: <span className="accent-gold">Can you make one full swing take 2 seconds?</span>
            </h2>
            <p>Adjust the settings and experiment. You will learn what really controls the time.</p>
            <button className="button outline small" onClick={() => setPhase("lab")}>
              View Challenge Details
            </button>
            <div className="hourglass" aria-hidden="true" />
          </Panel>
        </div>
      </div>
    </section>
  );
}

type SimulationApi = ReturnType<typeof usePendulumSimulation>;

function LabPhaseView({
  simulation,
  pendulumCanvasRef,
  graphCanvasRef,
  setPhase,
  onOpenDialog,
}: {
  simulation: SimulationApi;
  pendulumCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  graphCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  setPhase: (phase: LabPhase) => void;
  onOpenDialog: (dialog: "formula" | "liveGraph") => void;
}) {
  const canOpenResults = simulation.runs.length > 0;

  return (
    <section aria-labelledby="lab-title">
      <LabHero phase="lab" setPhase={setPhase} canOpenResults={canOpenResults} />
      <div className="lab-layout">
        <Panel className="control-panel" ariaLabel="Pendulum controls">
          <div className="control-header">
            <h3 className="section-title">Controls</h3>
            <button className="reset-button" type="button" onClick={simulation.resetDefaults}>
              Reset to Defaults
            </button>
          </div>

          {pendulumLab.controls.map((control) => (
            <RangeControl
              key={control.key}
              label={control.label}
              icon={control.icon}
              value={simulation.settings[control.key]}
              min={control.min}
              max={control.max}
              step={control.step}
              accent={control.accent}
              displayValue={`${simulation.settings[control.key].toFixed(2)} ${control.unit}`}
              onChange={(value) => simulation.updateSetting(control.key as keyof PendulumSettings, value)}
            />
          ))}

          <div className="tip-card">
            <div className="round-icon">!</div>
            <p>
              <strong>Tip</strong>Changing any slider instantly resets the simulation and graph.
            </p>
          </div>

          <div className="button-row">
            <button className="button green small" type="button" onClick={simulation.start}>
              {simulation.running && !simulation.paused ? "Running" : "Start"}
            </button>
            <button className="button blue small" type="button" disabled={!simulation.running} onClick={simulation.togglePause}>
              {simulation.paused ? "Resume" : "Pause"}
            </button>
            <button className="button purple small" type="button" onClick={simulation.restart}>
              Restart
            </button>
          </div>
          <p className="status-line" aria-live="polite">
            {simulation.statusMessage}
          </p>
        </Panel>

        <section className="simulation-card" aria-label="Pendulum simulation">
          <CanvasSurface canvasRef={pendulumCanvasRef} ariaLabel="Pendulum animation" />
          <div className="sim-time">
            Time <b>{simulation.sample.time.toFixed(2)} s</b>
          </div>
          <div className="sim-readout">
            <span>
              Length (L): <b>{simulation.settings.length.toFixed(2)} m</b>
            </span>
            <span>
              Mass (m): <b>{simulation.settings.mass.toFixed(2)} kg</b>
            </span>
            <span>
              g: <b>9.81 m/s2</b>
            </span>
          </div>
        </section>

        <aside className="right-stack">
          <Panel className="graph-card">
            <div className="card-title-row">
              <h2>Angle vs Time</h2>
              <button className="link-button" type="button" onClick={() => onOpenDialog("liveGraph")}>
                Expand
              </button>
            </div>
            <CanvasSurface canvasRef={graphCanvasRef} ariaLabel="Angle over time graph" />
          </Panel>
          <Panel className="formula-card">
            <div className="card-title-row">
              <div className="round-icon square">fx</div>
              <h2>Small-Angle Model</h2>
              <button className="link-button" type="button" onClick={() => onOpenDialog("formula")}>
                Learn more
              </button>
            </div>
            <div className="formula-box">
              <p className="formula-main">theta(t) = theta0 cos(omega t) + (omega0 / omega) sin(omega t)</p>
              <div className="formula-notes">
                <span>where omega = sqrt(g / L)</span>
                <span>theta0 = initial angle</span>
                <span>omega0 = initial angular velocity</span>
                <span>g = 9.81 m/s2, no friction</span>
              </div>
            </div>
          </Panel>
        </aside>
      </div>

      <div className="lab-bottom">
        <Panel className="lab-challenge">
          <div className="round-icon large">T</div>
          <div>
            <h3 className="section-title">Lab Challenge</h3>
            <p>{pendulumLab.challenge}</p>
            <p className="muted">Record up to 3 runs, then compare your data on the results page.</p>
          </div>
          <div className="challenge-actions">
            <div className="metric-ring">
              <span>
                Best So Far
                <b>{simulation.bestPeriod ? `${simulation.bestPeriod.toFixed(2)} s` : "--"}</b>
              </span>
            </div>
            <button className="button green small" type="button" disabled={!simulation.canRecord} onClick={simulation.recordRun}>
              {simulation.runs.length >= 3 ? "Replace Oldest Run" : `Record Run${simulation.runs.length ? ` ${simulation.runs.length + 1}` : ""}`}
            </button>
            <button className="button purple small" type="button" disabled={!canOpenResults} onClick={() => setPhase("results")}>
              See Results
            </button>
          </div>
        </Panel>
        <Panel className="insight-card">
          <div className="round-icon large">!</div>
          <div>
            <h3 className="section-title orange">Key Insight</h3>
            <p>In a simple pendulum without friction: Length changes the period. Mass does not.</p>
          </div>
        </Panel>
      </div>
    </section>
  );
}

function ResultsPhase({
  displayRuns,
  hasRuns,
  replayCanvasRef,
  resultsGraphCanvasRef,
  setPhase,
  onOpenDialog,
}: {
  displayRuns: PendulumRun[];
  hasRuns: boolean;
  replayCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  resultsGraphCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  setPhase: (phase: LabPhase) => void;
  onOpenDialog: (dialog: "resultsGraph") => void;
}) {
  const referenceLength = displayRuns[0]?.length ?? 2;

  return (
    <section aria-labelledby="results-title">
      <LabHero phase="results" setPhase={setPhase} canOpenResults={hasRuns} />

      {!hasRuns && <EmptyResults setPhase={setPhase} />}

      {hasRuns && (
        <>

      <div className="results-layout">
        <Panel className="results-canvas-card">
          <h3 className="section-title">Simulation Replay</h3>
          <CanvasSurface canvasRef={replayCanvasRef} ariaLabel="Replay of three pendulum runs" />
        </Panel>
        <Panel className="results-canvas-card">
          <div className="card-title-row">
            <h2>Angle vs Time Comparison</h2>
            <button className="link-button" type="button" onClick={() => onOpenDialog("resultsGraph")}>
              View Details
            </button>
          </div>
          <CanvasSurface canvasRef={resultsGraphCanvasRef} ariaLabel="Comparison graph of three runs" />
        </Panel>
        <Panel className="achievement-card">
          <BadgeMedal label="D" tone="purple" size="large" />
          <div>
            <h3 className="section-title purple">Badge Unlocked</h3>
            <h2>Data Detective</h2>
            <p>You compared data like a real scientist!</p>
            <div className="check-list">
              <span>Checked: Ran 3 experiments</span>
              <span>Checked: Collected data</span>
              <span>Checked: Compared results</span>
            </div>
            <span className="xp-pill">+ 100 XP</span>
          </div>
        </Panel>
      </div>

      <div className="results-mid">
        <Panel className="table-card">
          <h3 className="section-title">Experiment Log</h3>
          <table>
            <thead>
              <tr>
                <th>Trial</th>
                <th>Length (m)</th>
                <th>Mass (kg)</th>
                <th>Initial Angle (rad)</th>
                <th>Average Period (s)</th>
                <th>Outcome</th>
              </tr>
            </thead>
            <tbody>
              {displayRuns.map((run) => (
                <tr key={run.id}>
                  <td>
                    <span className={`trial-dot run-${run.id}`}>{run.id}</span>
                  </td>
                  <td>{run.length.toFixed(2)}</td>
                  <td>{run.mass.toFixed(2)}</td>
                  <td>{run.theta0.toFixed(2)}</td>
                  <td>{run.period.toFixed(2)}</td>
                  <td>
                    <span className={`outcome ${run.warn ? "warn" : ""}`}>{run.outcome}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="theory-note">
            Theoretical period for L = {referenceLength.toFixed(2)} m: {smallAnglePeriod(referenceLength).toFixed(2)} s
          </div>
        </Panel>

        <Panel className="reflection-card">
          <h3 className="section-title">What You Discovered</h3>
          <div className="discovery-list">
            {pendulumLab.learningGoals.map((goal) => (
              <article className="discovery-item" key={goal.id}>
                <div className="round-icon">{goal.icon}</div>
                <div>
                  <h3>{goal.title}</h3>
                  <p>{goal.body}</p>
                </div>
              </article>
            ))}
          </div>
        </Panel>

        <Panel className="next-card">
          <h3 className="section-title">What's Next?</h3>
          <div className="next-actions">
            <button className="next-action" onClick={() => setPhase("lab")}>
              <span className="round-icon">L</span>
              <span>
                <b>Try a different length</b>
                <small>See how changing length changes the period.</small>
              </span>
              <span aria-hidden="true">-&gt;</span>
            </button>
            <button className="next-action disabled" type="button" disabled aria-disabled="true">
              <span className="round-icon">~</span>
              <span>
                <b>Explore damping next</b>
                <small>Discover how friction slows the swing over time.</small>
              </span>
              <span className="coming-soon" aria-hidden="true">Soon</span>
            </button>
          </div>
        </Panel>
      </div>
        </>
      )}
    </section>
  );
}

function EmptyResults({ setPhase }: { setPhase: (phase: LabPhase) => void }) {
  return (
    <div className="empty-results-wrap">
      <Panel className="empty-results">
        <div className="round-icon large">D</div>
        <div>
          <h3 className="section-title">Results need real data</h3>
          <h2>Record at least one experiment run first.</h2>
          <p>
            This page no longer uses hidden sample data. Run the pendulum, record a trial, and your comparison graph,
            experiment log, and reflection prompts will appear here.
          </p>
        </div>
        <button className="button green" type="button" onClick={() => setPhase("lab")}>
          Go Record a Run
        </button>
      </Panel>
    </div>
  );
}

function LabHero({
  phase,
  setPhase,
  canOpenResults,
}: {
  phase: "lab" | "results";
  setPhase: (phase: LabPhase) => void;
  canOpenResults: boolean;
}) {
  const currentPhase = phase === "lab" ? "lab" : "results";
  const title = phase === "lab" ? pendulumLab.title : pendulumLab.resultsTitle;
  const copy = phase === "lab" ? pendulumLab.labCopy : pendulumLab.resultsCopy;
  const progress = phaseProgress[currentPhase];

  return (
    <div className="space-hero">
      <div className="phase-hero">
        <div>
          <h2 className="hero-title compact" id={phase === "lab" ? "lab-title" : "results-title"}>
            {title}
          </h2>
          <p className="hero-copy">{copy}</p>
        </div>
        <div className="hero-side">
          <aside className="glass-panel stepper-card" aria-label="Phase progress">
            <h3>Phase {phaseIndex(currentPhase) + 1} of 3</h3>
            <div className="stepper">
              {(["mission", "lab", "results"] as const).map((item) => (
                <button
                  key={item}
                  className={`step ${phaseIndex(item) < phaseIndex(currentPhase) ? "done" : ""} ${item === currentPhase ? "active" : ""}`}
                  type="button"
                  disabled={item === "results" && !canOpenResults}
                  aria-current={item === currentPhase ? "step" : undefined}
                  onClick={() => setPhase(item)}
                >
                  <span>{phaseIndex(item) + 1}</span>
                  {pendulumLab.phaseLabels[item]}
                </button>
              ))}
            </div>
          </aside>
          <aside className="glass-panel phase-card">
            <h3>
              <BadgeMedal label={phase === "lab" ? "A" : "D"} size="small" />
              Lab Progress <span>{progress}%</span>
            </h3>
            <ProgressBar value={progress} />
            <p>{phase === "lab" ? "Keep experimenting!" : "All activities complete!"}</p>
          </aside>
        </div>
      </div>
    </div>
  );
}

function DialogHost({
  activeDialog,
  onClose,
  modalGraphCanvasRef,
  modalResultsGraphCanvasRef,
  hasRuns,
}: {
  activeDialog: null | "intro" | "formula" | "liveGraph" | "resultsGraph";
  onClose: () => void;
  modalGraphCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  modalResultsGraphCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  hasRuns: boolean;
}) {
  useEffect(() => {
    if (!activeDialog) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeDialog, onClose]);

  if (!activeDialog) return null;

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className={`modal-panel ${activeDialog === "liveGraph" || activeDialog === "resultsGraph" ? "wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${activeDialog}-title`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="modal-close" type="button" aria-label="Close dialog" onClick={onClose}>
          x
        </button>
        {activeDialog === "intro" && (
          <>
            <h2 id="intro-title">How this mission works</h2>
            <div className="intro-steps">
              <article>
                <b>1. Predict</b>
                <p>Guess which setting changes the swing time before you touch the controls.</p>
              </article>
              <article>
                <b>2. Test</b>
                <p>Run the pendulum and compare the curved motion with the small-angle model.</p>
              </article>
              <article>
                <b>3. Explain</b>
                <p>Record runs, compare patterns, and use evidence in your reflection.</p>
              </article>
            </div>
          </>
        )}
        {activeDialog === "formula" && (
          <>
            <h2 id="formula-title">Small-angle model</h2>
            <p>
              The analytical line assumes the angle is small, so sin(theta) behaves almost like theta. That shortcut
              predicts the timing very well near the starting default, then becomes less exact for larger angles.
            </p>
            <div className="formula-box modal-formula">
              <p className="formula-main">theta(t) = theta0 cos(omega t) + (omega0 / omega) sin(omega t)</p>
              <div className="formula-notes">
                <span>omega = sqrt(g / L)</span>
                <span>L controls the period</span>
                <span>mass does not change timing</span>
                <span>larger angles stretch the model</span>
              </div>
            </div>
          </>
        )}
        {activeDialog === "liveGraph" && (
          <>
            <h2 id="liveGraph-title">Live angle comparison</h2>
            <p>The solid line is the RK4 nonlinear simulation. The dashed line is the small-angle prediction.</p>
            <CanvasSurface canvasRef={modalGraphCanvasRef} className="modal-canvas" ariaLabel="Expanded live angle graph" />
          </>
        )}
        {activeDialog === "resultsGraph" && (
          <>
            <h2 id="resultsGraph-title">Recorded run comparison</h2>
            <p>Each color represents one run you recorded in the lab phase.</p>
            {hasRuns ? (
              <CanvasSurface canvasRef={modalResultsGraphCanvasRef} className="modal-canvas" ariaLabel="Expanded results comparison graph" />
            ) : (
              <p className="status-line">Record a run before viewing result details.</p>
            )}
          </>
        )}
      </section>
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="progress-line">
      <div className="track" aria-hidden="true">
        <span style={{ width: `${value}%` }} />
      </div>
      <strong>{value}%</strong>
    </div>
  );
}
