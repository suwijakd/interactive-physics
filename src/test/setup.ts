import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

const canvasContext = {
  arc: vi.fn(),
  arcTo: vi.fn(),
  beginPath: vi.fn(),
  clearRect: vi.fn(),
  closePath: vi.fn(),
  createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
  createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
  fill: vi.fn(),
  fillRect: vi.fn(),
  fillText: vi.fn(),
  lineTo: vi.fn(),
  moveTo: vi.fn(),
  restore: vi.fn(),
  rotate: vi.fn(),
  save: vi.fn(),
  setLineDash: vi.fn(),
  setTransform: vi.fn(),
  stroke: vi.fn(),
  translate: vi.fn(),
};

Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  value: vi.fn(() => canvasContext),
});

Object.defineProperty(HTMLCanvasElement.prototype, "getBoundingClientRect", {
  value: vi.fn(() => ({
    width: 520,
    height: 300,
    top: 0,
    left: 0,
    right: 520,
    bottom: 300,
    x: 0,
    y: 0,
    toJSON: () => undefined,
  })),
});
