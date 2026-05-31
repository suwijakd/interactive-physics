import type { PendulumRun, PendulumSettings } from "./pendulumContent";
import { estimatePeriod, smallAnglePeriod } from "./physics";

export function classifyOutcome(period: number, length: number) {
  const drift = Math.abs(period - smallAnglePeriod(length)) / smallAnglePeriod(length);
  if (drift < 0.015) return { text: "Great match", warn: false };
  if (drift < 0.04) return { text: "Good match", warn: false };
  return { text: "Model stretched", warn: true };
}

export function createRun(id: number, settings: PendulumSettings): PendulumRun {
  const period = estimatePeriod(settings);
  const outcome = classifyOutcome(period, settings.length);
  return {
    id,
    ...settings,
    period,
    outcome: outcome.text,
    warn: outcome.warn,
  };
}

export function seedRuns(): PendulumRun[] {
  return [0.05, 0.35, 0.65].map((theta0, index) =>
    createRun(index + 1, {
      mass: 1,
      length: 2,
      theta0,
      omega0: 0,
    }),
  );
}
