import type { PendulumRun, PendulumSettings } from "./pendulumContent";
import { resizeCanvas } from "./renderGraphs";

type DrawState = PendulumSettings & {
  theta: number;
  time: number;
};

function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = "#082659";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "rgba(48, 118, 205, 0.18)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= width; x += 28) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += 28) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

export function drawPendulum(canvas: HTMLCanvasElement, state: DrawState) {
  const { ctx, width, height } = resizeCanvas(canvas);
  drawGrid(ctx, width, height);

  const pivotX = width * 0.5;
  const pivotY = 46;
  const scale = Math.min((height - 130) / Math.max(state.length, 0.6), (width * 0.42) / Math.max(0.55, state.length));
  const lengthPx = state.length * scale;
  const bobRadius = 18 + Math.min(20, state.mass * 2.6);
  const bobX = pivotX + lengthPx * Math.sin(state.theta);
  const bobY = pivotY + lengthPx * Math.cos(state.theta);

  ctx.save();
  ctx.strokeStyle = "rgba(42, 157, 255, 0.92)";
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 10]);
  ctx.beginPath();
  ctx.arc(pivotX, pivotY, lengthPx, Math.PI * 0.5 - 0.78, Math.PI * 0.5 + 0.78);
  ctx.stroke();
  ctx.restore();

  [-0.5, 0.42].forEach((ghostAngle) => {
    const gx = pivotX + lengthPx * Math.sin(ghostAngle);
    const gy = pivotY + lengthPx * Math.cos(ghostAngle);
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(gx, gy);
    ctx.stroke();
    ctx.fillStyle = "#9fb1c8";
    ctx.beginPath();
    ctx.arc(gx, gy, bobRadius * 0.86, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });

  ctx.strokeStyle = "rgba(255, 255, 255, 0.78)";
  ctx.lineWidth = 2;
  ctx.setLineDash([7, 8]);
  ctx.beginPath();
  ctx.moveTo(pivotX, pivotY);
  ctx.lineTo(pivotX, Math.min(height - 95, pivotY + lengthPx + 70));
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(pivotX, pivotY);
  ctx.lineTo(bobX, bobY);
  ctx.stroke();

  const bobGradient = ctx.createRadialGradient(bobX - bobRadius * 0.35, bobY - bobRadius * 0.35, bobRadius * 0.1, bobX, bobY, bobRadius);
  bobGradient.addColorStop(0, "#ffffff");
  bobGradient.addColorStop(0.38, "#d7dde7");
  bobGradient.addColorStop(0.78, "#697382");
  bobGradient.addColorStop(1, "#f3f7fc");
  ctx.fillStyle = bobGradient;
  ctx.beginPath();
  ctx.arc(bobX, bobY, bobRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,.65)";
  ctx.lineWidth = 2;
  ctx.stroke();

  const supportGradient = ctx.createLinearGradient(pivotX - 80, 28, pivotX + 80, 50);
  supportGradient.addColorStop(0, "#f9f8f1");
  supportGradient.addColorStop(1, "#717f92");
  ctx.fillStyle = supportGradient;
  roundRect(ctx, pivotX - 86, 28, 172, 18, 6);
  ctx.fill();
  ctx.fillStyle = "#cfd8e6";
  ctx.beginPath();
  ctx.arc(pivotX, pivotY, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#ffc72c";
  ctx.lineWidth = 3;
  ctx.beginPath();
  const start = -Math.PI / 2;
  const end = start + state.theta;
  ctx.arc(pivotX, pivotY + 77, 54, Math.min(start, end), Math.max(start, end));
  ctx.stroke();
  ctx.fillStyle = "#ffc72c";
  ctx.font = "bold 19px Trebuchet MS, sans-serif";
  ctx.fillText(`theta = ${state.theta.toFixed(2)} rad`, pivotX + 56, pivotY + 116);
}

export function drawReplay(canvas: HTMLCanvasElement, runs: PendulumRun[]) {
  const { ctx, width, height } = resizeCanvas(canvas);
  drawGrid(ctx, width, height);
  const pivotX = width * 0.5;
  const pivotY = 28;
  const lengthPx = Math.min(height - 72, width * 0.42);
  const colors = ["#7937e8", "#0aa8b3", "#ff7b13"];

  ctx.fillStyle = "#cfd8e6";
  roundRect(ctx, pivotX - 70, pivotY - 10, 140, 12, 5);
  ctx.fill();
  ctx.fillStyle = "#dbe5f3";
  ctx.beginPath();
  ctx.arc(pivotX, pivotY, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.setLineDash([7, 7]);
  runs.forEach((run, index) => {
    const theta = run.theta0;
    const bobX = pivotX + lengthPx * Math.sin(theta);
    const bobY = pivotY + lengthPx * Math.cos(theta);
    ctx.strokeStyle = colors[index] ?? "#7937e8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(bobX, bobY);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(pivotX, pivotY, lengthPx, Math.PI * 0.5 - Math.abs(theta), Math.PI * 0.5 + Math.abs(theta));
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = colors[index] ?? "#7937e8";
    ctx.beginPath();
    ctx.arc(bobX, bobY, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.setLineDash([7, 7]);
  });
  ctx.setLineDash([]);

  ctx.font = "bold 13px Trebuchet MS, sans-serif";
  ctx.textAlign = "center";
  runs.forEach((run, index) => {
    const x = width * (0.25 + index * 0.25);
    const y = height - 20;
    ctx.fillStyle = colors[index] ?? "#7937e8";
    ctx.beginPath();
    ctx.arc(x - 28, y - 1, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.fillText(`Run ${run.id}`, x + 10, y);
  });
}
