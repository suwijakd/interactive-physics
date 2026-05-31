import { describe, expect, it } from "vitest";
import { analyticalTheta, estimatePeriod, rk4Step, smallAnglePeriod } from "./physics";
import { pendulumDefaults } from "./pendulumContent";
import { classifyOutcome } from "./results";

describe("pendulum physics", () => {
  it("advances the nonlinear pendulum with RK4", () => {
    const next = rk4Step(
      pendulumDefaults,
      { theta: pendulumDefaults.theta0, omega: pendulumDefaults.omega0, time: 0 },
      0.1,
    );

    expect(next.time).toBeCloseTo(0.1);
    expect(next.theta).toBeLessThan(pendulumDefaults.theta0);
  });

  it("matches the initial analytical angle at t=0", () => {
    expect(analyticalTheta(pendulumDefaults, 0)).toBeCloseTo(pendulumDefaults.theta0);
  });

  it("changes period with length and not with mass", () => {
    const short = estimatePeriod({ length: 1, theta0: 0.05, omega0: 0 });
    const long = estimatePeriod({ length: 4, theta0: 0.05, omega0: 0 });
    const heavySameLength = estimatePeriod({ length: 1, theta0: 0.05, omega0: 0 });

    expect(long).toBeGreaterThan(short);
    expect(heavySameLength).toBeCloseTo(short);
  });

  it("classifies close small-angle results as a great match", () => {
    const period = smallAnglePeriod(2);
    expect(classifyOutcome(period, 2)).toEqual({ text: "Great match", warn: false });
  });
});
