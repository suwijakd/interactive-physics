import { useEffect, useState } from "react";
import { AppShell } from "./AppShell";
import { phaseFromHash, phaseToHash, type LabPhase } from "./routes";
import { PendulumLab } from "../labs/pendulum/PendulumLab";

export function App() {
  const [phase, setPhaseState] = useState<LabPhase>(() => phaseFromHash(window.location.hash));

  useEffect(() => {
    const handleHashChange = () => setPhaseState(phaseFromHash(window.location.hash));
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const setPhase = (nextPhase: LabPhase) => {
    if (window.location.hash !== phaseToHash(nextPhase)) {
      window.history.replaceState(null, "", phaseToHash(nextPhase));
    }
    setPhaseState(nextPhase);
  };

  return (
    <AppShell phase={phase}>
      <PendulumLab phase={phase} setPhase={setPhase} />
    </AppShell>
  );
}
