export type LabPhase = "mission" | "lab" | "results";
export type AppView = "dashboard" | "labs" | "quests" | "notebook" | "badges" | "pendulum";

export type AppRoute = {
  view: AppView;
  phase: LabPhase;
};

export const phases: LabPhase[] = ["mission", "lab", "results"];
export const appViews: AppView[] = ["dashboard", "labs", "quests", "notebook", "badges"];

export function phaseFromHash(hash: string): LabPhase {
  const normalized = hash.replace("#", "").toLowerCase();
  if (normalized === "lab" || normalized === "experiment") return "lab";
  if (normalized === "results" || normalized === "reflection") return "results";
  return "mission";
}

export function phaseToHash(phase: LabPhase): string {
  return `#${phase}`;
}

export function phaseIndex(phase: LabPhase): number {
  return phases.indexOf(phase);
}

export function routeFromHash(hash: string): AppRoute {
  const normalized = hash.replace("#", "").toLowerCase();
  if (normalized === "lab" || normalized === "experiment" || normalized === "mission" || normalized === "results" || normalized === "reflection") {
    return { view: "pendulum", phase: phaseFromHash(hash) };
  }
  if (appViews.includes(normalized as AppView)) {
    return { view: normalized as AppView, phase: "mission" };
  }
  return { view: "pendulum", phase: "mission" };
}

export function viewToHash(view: AppView): string {
  return view === "pendulum" ? "#mission" : `#${view}`;
}
