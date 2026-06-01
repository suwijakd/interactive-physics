import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GraphPoint, PendulumRun, PendulumSettings } from "./pendulumContent";
import { pendulumDefaults } from "./pendulumContent";
import { analyticalTheta, generatePreviewHistory, rk4Step, type PendulumState } from "./physics";
import { createRun } from "./results";

type SimulationSample = PendulumSettings & PendulumState;

export function usePendulumSimulation() {
  const [settings, setSettings] = useState<PendulumSettings>(pendulumDefaults);
  const [sample, setSample] = useState<SimulationSample>(() => ({
    ...pendulumDefaults,
    theta: pendulumDefaults.theta0,
    omega: pendulumDefaults.omega0,
    time: 0,
  }));
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [history, setHistory] = useState<GraphPoint[]>(() => generatePreviewHistory(pendulumDefaults));
  const [runs, setRuns] = useState<PendulumRun[]>([]);
  const [bestPeriod, setBestPeriod] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState("Adjust a slider or press Start to begin the experiment.");

  const stateRef = useRef<PendulumState>({ theta: pendulumDefaults.theta0, omega: pendulumDefaults.omega0, time: 0 });
  const settingsRef = useRef(settings);
  const historyRef = useRef(history);
  const runningRef = useRef(running);
  const pausedRef = useRef(paused);
  const lastFrameRef = useRef<number | null>(null);

  settingsRef.current = settings;
  historyRef.current = history;
  runningRef.current = running;
  pausedRef.current = paused;

  const resetSimulation = useCallback((nextSettings = settingsRef.current, stop = true) => {
    settingsRef.current = nextSettings;
    stateRef.current = { theta: nextSettings.theta0, omega: nextSettings.omega0, time: 0 };
    const nextHistory = generatePreviewHistory(nextSettings);
    historyRef.current = nextHistory;
    setSettings(nextSettings);
    setSample({ ...nextSettings, ...stateRef.current });
    setHistory(nextHistory);
    setStatusMessage(stop ? "Simulation reset. The graph now uses the current settings." : "Simulation updated.");
    if (stop) {
      setRunning(false);
      setPaused(false);
      lastFrameRef.current = null;
    }
  }, []);

  const updateSetting = useCallback(
    (key: keyof PendulumSettings, value: number) => {
      resetSimulation({ ...settingsRef.current, [key]: value });
    },
    [resetSimulation],
  );

  const resetDefaults = useCallback(() => resetSimulation(pendulumDefaults), [resetSimulation]);

  useEffect(() => {
    let animationFrame = 0;

    const loop = (timestamp: number) => {
      if (lastFrameRef.current === null) lastFrameRef.current = timestamp;
      const elapsed = Math.min(0.06, (timestamp - lastFrameRef.current) / 1000);
      lastFrameRef.current = timestamp;

      if (runningRef.current && !pausedRef.current) {
        let remaining = elapsed;
        const subStep = 1 / 120;
        const currentSettings = settingsRef.current;
        while (remaining > 0) {
          const dt = Math.min(subStep, remaining);
          stateRef.current = rk4Step(currentSettings, stateRef.current, dt);
          remaining -= dt;
        }
        const point = {
          t: stateRef.current.time,
          numerical: stateRef.current.theta,
          analytical: analyticalTheta(currentSettings, stateRef.current.time),
        };
        const nextHistory = [...historyRef.current, point].slice(-1200);
        historyRef.current = nextHistory;
        setSample({ ...currentSettings, ...stateRef.current });
        setHistory(nextHistory);
      }

      animationFrame = window.requestAnimationFrame(loop);
    };

    animationFrame = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(animationFrame);
  }, []);

  const start = useCallback(() => {
    lastFrameRef.current = null;
    setRunning(true);
    setPaused(false);
    setStatusMessage("Experiment running. Watch the graph compare numerical and analytical motion.");
  }, []);

  const togglePause = useCallback(() => {
    if (!runningRef.current) {
      setStatusMessage("Start the experiment before pausing it.");
      return;
    }
    setPaused((current) => {
      const nextPaused = !current;
      setStatusMessage(nextPaused ? "Experiment paused. Press Resume to continue." : "Experiment resumed.");
      return nextPaused;
    });
  }, []);

  const restart = useCallback(() => {
    resetSimulation(settingsRef.current);
    setStatusMessage("Experiment restarted from the current settings.");
  }, [resetSimulation]);

  const recordRun = useCallback(() => {
    if (!runningRef.current && stateRef.current.time < 0.1) {
      setStatusMessage("Start the experiment before recording a run.");
      return false;
    }
    setRuns((currentRuns) => {
      const nextRun = createRun(Math.min(3, currentRuns.length + 1), settingsRef.current);
      const nextRuns = currentRuns.length >= 3 ? [...currentRuns.slice(1), nextRun] : [...currentRuns, nextRun];
      return nextRuns.map((run, index) => ({ ...run, id: index + 1 }));
    });
    const recorded = createRun(1, settingsRef.current);
    setBestPeriod((currentBest) => {
      if (currentBest === null) return recorded.period;
      return Math.abs(recorded.period - 2) < Math.abs(currentBest - 2) ? recorded.period : currentBest;
    });
    setStatusMessage(runs.length >= 3 ? "Recorded a new run and replaced the oldest result." : `Recorded run ${runs.length + 1}. Results are now available.`);
    return true;
  }, [runs.length]);

  const visibleHistory = useMemo(() => (history.length > 3 ? history : generatePreviewHistory(settings)), [history, settings]);
  const canRecord = running || sample.time >= 0.1;

  return {
    settings,
    sample,
    history: visibleHistory,
    runs,
    bestPeriod,
    running,
    paused,
    canRecord,
    statusMessage,
    updateSetting,
    resetDefaults,
    resetSimulation,
    start,
    togglePause,
    restart,
    recordRun,
  };
}
