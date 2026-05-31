import type { GraphPoint, PendulumSettings } from "./pendulumContent";

export const GRAVITY = 9.81;

export type PendulumState = {
  theta: number;
  omega: number;
  time: number;
};

export function analyticalTheta(settings: PendulumSettings, time: number): number {
  const naturalOmega = Math.sqrt(GRAVITY / settings.length);
  return (
    settings.theta0 * Math.cos(naturalOmega * time) +
    (settings.omega0 / naturalOmega) * Math.sin(naturalOmega * time)
  );
}

export function pendulumDerivatives(settings: PendulumSettings, theta: number, omega: number) {
  return {
    dTheta: omega,
    dOmega: -(GRAVITY / settings.length) * Math.sin(theta),
  };
}

export function rk4Step(settings: PendulumSettings, current: PendulumState, dt: number): PendulumState {
  const k1 = pendulumDerivatives(settings, current.theta, current.omega);
  const k2 = pendulumDerivatives(
    settings,
    current.theta + 0.5 * dt * k1.dTheta,
    current.omega + 0.5 * dt * k1.dOmega,
  );
  const k3 = pendulumDerivatives(
    settings,
    current.theta + 0.5 * dt * k2.dTheta,
    current.omega + 0.5 * dt * k2.dOmega,
  );
  const k4 = pendulumDerivatives(settings, current.theta + dt * k3.dTheta, current.omega + dt * k3.dOmega);

  return {
    theta: current.theta + (dt / 6) * (k1.dTheta + 2 * k2.dTheta + 2 * k3.dTheta + k4.dTheta),
    omega: current.omega + (dt / 6) * (k1.dOmega + 2 * k2.dOmega + 2 * k3.dOmega + k4.dOmega),
    time: current.time + dt,
  };
}

export function generatePreviewHistory(settings: PendulumSettings, duration = 12, dt = 0.04): GraphPoint[] {
  let state: PendulumState = {
    theta: settings.theta0,
    omega: settings.omega0,
    time: 0,
  };
  const points: GraphPoint[] = [];

  for (let t = 0; t <= duration; t += dt) {
    points.push({
      t,
      numerical: state.theta,
      analytical: analyticalTheta(settings, t),
    });
    state = rk4Step(settings, state, dt);
  }

  return points;
}

export function estimatePeriod(settings: Pick<PendulumSettings, "length" | "theta0" | "omega0">): number {
  const naturalOmega = Math.sqrt(GRAVITY / settings.length);
  const amplitude = Math.min(1.2, Math.sqrt(settings.theta0 ** 2 + (settings.omega0 / naturalOmega) ** 2));
  const basePeriod = 2 * Math.PI * Math.sqrt(settings.length / GRAVITY);
  return basePeriod * (1 + amplitude ** 2 / 16 + (11 * amplitude ** 4) / 3072);
}

export function smallAnglePeriod(length: number): number {
  return 2 * Math.PI * Math.sqrt(length / GRAVITY);
}
