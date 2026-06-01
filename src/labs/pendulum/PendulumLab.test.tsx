import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { App } from "../../app/App";

describe("PendulumLab", () => {
  beforeEach(() => {
    window.location.hash = "";
  });

  it("navigates through the three-phase learning flow", async () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "Pendulum Playground" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Start Lab" }));
    expect(screen.getByRole("heading", { name: "Simple Pendulum Lab" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Start" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Record Run" })).not.toBeDisabled(), { timeout: 1500 });
    fireEvent.click(screen.getByRole("button", { name: "Record Run" }));
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

  it("records runs in the experiment log", async () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Start Lab" }));
    fireEvent.click(screen.getByRole("button", { name: "Start" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Record Run" })).not.toBeDisabled(), { timeout: 1500 });
    fireEvent.click(screen.getByRole("button", { name: "Record Run" }));
    fireEvent.click(screen.getByRole("button", { name: "See Results" }));

    expect(screen.getByText("Experiment Log")).toBeInTheDocument();
    expect(screen.getAllByText("Great match").length).toBeGreaterThan(0);
  });

  it("routes top navigation to product shell views", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Dashboard" }));
    expect(screen.getByRole("heading", { name: "Ready for today's physics mission?" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Labs" }));
    expect(screen.getByRole("heading", { name: "Choose a lab to explore" })).toBeInTheDocument();
  });

  it("keeps results locked until a real run is recorded", () => {
    window.location.hash = "#results";
    render(<App />);

    expect(screen.getByRole("heading", { name: "Record at least one experiment run first." })).toBeInTheDocument();
    expect(screen.queryByText("Experiment Log")).not.toBeInTheDocument();
  });

  it("opens completed secondary action dialogs", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Watch Intro 2:12 min" }));
    expect(screen.getByRole("dialog", { name: "How this mission works" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Close dialog" }));

    fireEvent.click(screen.getByRole("button", { name: "Start Lab" }));
    fireEvent.click(screen.getByRole("button", { name: "Learn more" }));
    expect(screen.getByRole("dialog", { name: "Small-angle model" })).toBeInTheDocument();
  });
});
