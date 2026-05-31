export type LabPhase = "mission" | "lab" | "results";

export const phases: LabPhase[] = ["mission", "lab", "results"];

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
