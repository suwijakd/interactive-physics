import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { App } from "../../app/App";

describe("PendulumLab", () => {
  beforeEach(() => {
    window.location.hash = "";
  });

  it("navigates through the three-phase learning flow", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "Pendulum Playground" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Start Lab" }));
    expect(screen.getByRole("heading", { name: "Simple Pendulum Lab" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "See Results" }));
    expect(screen.getByRole("heading", { name: "Pendulum Challenge Results" })).toBeInTheDocument();
  });

  it("updates slider values and resets visible simulation time", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Start Lab" }));

    const lengthSlider = screen.getByLabelText("Length (L)") as HTMLInputElement;
    fireEvent.change(lengthSlider, { target: { value: "3" } });

    expect(screen.getAllByText("3.00 m").length).toBeGreaterThan(0);
    expect(screen.getByText("0.00 s")).toBeInTheDocument();
  });

  it("records runs in the experiment log", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Start Lab" }));
    fireEvent.click(screen.getByRole("button", { name: "Record Run" }));
    fireEvent.click(screen.getByRole("button", { name: "See Results" }));

    expect(screen.getByText("Experiment Log")).toBeInTheDocument();
    expect(screen.getAllByText("Great match").length).toBeGreaterThan(0);
  });
});
