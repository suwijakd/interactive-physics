# Interactive Physics

An interactive web-based physics learning platform for students in grades 7-9.

The first module is a simple pendulum without friction. It follows a three-phase learning journey:

1. Mission Launch: introduce the goal and invite students to make predictions.
2. Live Experiment Lab: adjust pendulum settings, run the simulation, and compare numerical motion with the small-angle model.
3. Results & Reflection: review experiment runs, compare graphs, unlock a badge, and summarize discoveries.

## Development

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Run checks:

```bash
npm test
npm run build
```

## Routes

The app uses lightweight hash routes while the platform has one lab:

- `/#mission`
- `/#lab`
- `/#results`

## Project Structure

- `src/app/`: platform shell, phase routing, and shared layout.
- `src/labs/pendulum/`: pendulum lab content, physics, simulation hook, renderers, and results logic.
- `src/components/`: reusable UI building blocks.
- `src/styles/`: design tokens, global styling, and component styling.
- `archive/prototype-v1.html`: original single-file prototype kept for reference.

## Physics Features

- Real-time simple pendulum animation.
- Runge-Kutta integration for the nonlinear pendulum equation.
- Adjustable mass, length, initial angle, and initial angular velocity.
- Angle vs. time graph with numerical and small-angle analytical comparison.
- Experiment logging and results comparison.

## Deployment

The project is configured for GitHub Pages with Vite `base: "/interactive-physics/"` and a Pages workflow in `.github/workflows/deploy.yml`.

## Design Assets

The `mockups/` folder contains the three approved visual mockups used as the design direction for the prototype.
