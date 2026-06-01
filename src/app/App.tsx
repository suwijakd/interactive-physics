import { useEffect, useState } from "react";
import { AppShell } from "./AppShell";
import { phaseToHash, routeFromHash, viewToHash, type AppRoute, type AppView, type LabPhase } from "./routes";
import { ProductView } from "./ProductView";
import { PendulumLab } from "../labs/pendulum/PendulumLab";

export function App() {
  const [route, setRouteState] = useState<AppRoute>(() => routeFromHash(window.location.hash));

  useEffect(() => {
    const handleHashChange = () => setRouteState(routeFromHash(window.location.hash));
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const setPhase = (nextPhase: LabPhase) => {
    if (window.location.hash !== phaseToHash(nextPhase)) {
      window.history.replaceState(null, "", phaseToHash(nextPhase));
    }
    setRouteState({ view: "pendulum", phase: nextPhase });
  };

  const setView = (nextView: AppView) => {
    const nextHash = viewToHash(nextView);
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, "", nextHash);
    }
    setRouteState((current) => ({ view: nextView, phase: nextView === "pendulum" ? "mission" : current.phase }));
  };

  return (
    <AppShell currentView={route.view} activeView={route.view === "pendulum" ? "labs" : route.view} phase={route.phase} onNavigate={setView}>
      {route.view === "pendulum" ? (
        <PendulumLab phase={route.phase} setPhase={setPhase} />
      ) : (
        <ProductView view={route.view} onOpenPendulum={() => setPhase("mission")} />
      )}
    </AppShell>
  );
}
