import type { LabPhase } from "../../app/routes";

export type PendulumSettings = {
  mass: number;
  length: number;
  theta0: number;
  omega0: number;
};

export type PendulumRun = PendulumSettings & {
  id: number;
  period: number;
  outcome: string;
  warn: boolean;
};

export type GraphPoint = {
  t: number;
  numerical: number;
  analytical: number;
};

export const pendulumDefaults: PendulumSettings = {
  mass: 1,
  length: 2,
  theta0: 0.05,
  omega0: 0,
};

export const pendulumLab = {
  title: "Simple Pendulum Lab",
  missionTitle: "Pendulum Playground",
  resultsTitle: "Pendulum Challenge Results",
  tagline: "Discover. Explore. Understand.",
  phaseLabels: {
    mission: "Mission",
    lab: "Experiment",
    results: "Results",
  } satisfies Record<LabPhase, string>,
  missionCopy:
    "Predict, test, and discover what controls a pendulum's swing. Change the settings, run the experiment, and see how the pendulum behaves.",
  labCopy: "Change the settings, watch the motion, and compare the math.",
  resultsCopy: "You ran 3 experiments. Now compare, explain, and level up.",
  challenge: "Can you make one complete swing take 2.00 seconds?",
  badges: [
    {
      id: "predictor",
      label: "Predictor",
      mark: "P",
      description: "Make smart predictions",
      tone: "purple" as const,
    },
    {
      id: "angle-explorer",
      label: "Angle Explorer",
      mark: "A",
      description: "Explore how angles affect the swing",
      tone: "teal" as const,
    },
    {
      id: "data-detective",
      label: "Data Detective",
      mark: "D",
      description: "Collect data and find patterns",
      tone: "green" as const,
    },
  ],
  learningGoals: [
    {
      id: "length",
      icon: "L",
      title: "Length changes the period",
      body: "A longer pendulum takes more time to swing back and forth.",
    },
    {
      id: "mass",
      icon: "kg",
      title: "Mass does not change the period",
      body: "Heavier or lighter, the timing stays the same.",
    },
    {
      id: "angle",
      icon: "A",
      title: "Larger angles test the model",
      body: "Big angles do not follow the simple rule as closely.",
    },
  ],
  controls: [
    {
      key: "mass",
      label: "Mass (m)",
      icon: "kg",
      unit: "kg",
      min: 0.1,
      max: 10,
      step: 0.1,
      accent: "purple" as const,
    },
    {
      key: "length",
      label: "Length (L)",
      icon: "L",
      unit: "m",
      min: 0.5,
      max: 5,
      step: 0.05,
      accent: "teal" as const,
    },
    {
      key: "theta0",
      label: "Initial Angle (theta0)",
      icon: "A",
      unit: "rad",
      min: -0.7,
      max: 0.7,
      step: 0.01,
      accent: "orange" as const,
    },
    {
      key: "omega0",
      label: "Initial Angular Velocity (omega0)",
      icon: "w",
      unit: "rad/s",
      min: -0.3,
      max: 0.3,
      step: 0.01,
      accent: "blue" as const,
    },
  ] as const,
};
