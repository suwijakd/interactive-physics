import type { PendulumRun } from "./pendulumContent";
import { GRAVITY } from "./physics";

type GraphSeries = {
  key: string;
  label: string;
  color: string;
  dashed?: boolean;
};

type GraphOptions = {
  yLabel: string;
  xLabel: string;
  windowSeconds: number;
  series: GraphSeries[];
};

type AnyGraphPoint = { t: number } & Record<string, number | undefined>;

export function resizeCanvas(canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.round(rect.width * ratio));
  canvas.height = Math.max(1, Math.round(rect.height * ratio));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context is unavailable");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  return { ctx, width: rect.width, height: rect.height };
}

export function drawTimeGraph(canvas: HTMLCanvasElement, points: AnyGraphPoint[], options: GraphOptions) {
  const { ctx, width, height } = resizeCanvas(canvas);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, height);

  const pad = { left: 62, right: 24, top: 18, bottom: 72 };
  const plotW = Math.max(1, width - pad.left - pad.right);
  const plotH = Math.max(1, height - pad.top - pad.bottom);
  const latest = points.length ? points[points.length - 1].t : 0;
  const endT = Math.max(options.windowSeconds, latest);
  const startT = Math.max(0, endT - options.windowSeconds);
  const visible = points.filter((point) => point.t >= startT && point.t <= endT);
  const maxAbs = Math.max(
    0.01,
    ...visible.flatMap((point) => options.series.map((series) => Math.abs(point[series.key] || 0))),
  );
  const paddedMax = maxAbs * 1.18;
  const yMax = paddedMax < 0.12 ? Math.max(0.06, Math.ceil(paddedMax * 100) / 100) : Math.min(1.4, Math.ceil(paddedMax * 10) / 10);
  const yMin = -yMax;

  ctx.strokeStyle = "#e2e8f3";
  ctx.lineWidth = 1;
  ctx.font = "12px Trebuchet MS, sans-serif";
  ctx.fillStyle = "#20304f";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";

  const yDigits = yMax < 0.2 ? 2 : 1;
  for (let i = 0; i <= 4; i += 1) {
    const yValue = yMin + ((yMax - yMin) * i) / 4;
    const cleanYValue = Math.abs(yValue) < 0.00001 ? 0 : yValue;
    const y = pad.top + plotH - ((yValue - yMin) / (yMax - yMin)) * plotH;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left + plotW, y);
    ctx.stroke();
    ctx.fillText(cleanYValue.toFixed(yDigits), pad.left - 8, y);
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  for (let i = 0; i <= 6; i += 1) {
    const time = startT + ((endT - startT) * i) / 6;
    const x = pad.left + ((time - startT) / (endT - startT)) * plotW;
    ctx.beginPath();
    ctx.moveTo(x, pad.top);
    ctx.lineTo(x, pad.top + plotH);
    ctx.stroke();
    ctx.fillText(time.toFixed(0), x, pad.top + plotH + 8);
  }

  ctx.strokeStyle = "#52617d";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(pad.left, pad.top);
  ctx.lineTo(pad.left, pad.top + plotH);
  ctx.lineTo(pad.left + plotW, pad.top + plotH);
  ctx.stroke();

  const mapX = (time: number) => pad.left + ((time - startT) / (endT - startT)) * plotW;
  const mapY = (value: number) => pad.top + plotH - ((value - yMin) / (yMax - yMin)) * plotH;

  options.series.forEach((series) => {
    ctx.save();
    ctx.strokeStyle = series.color;
    ctx.lineWidth = 3;
    if (series.dashed) ctx.setLineDash([7, 6]);
    ctx.beginPath();
    visible.forEach((point, index) => {
      const x = mapX(point.t);
      const y = mapY(point[series.key] || 0);
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.restore();
  });

  ctx.fillStyle = "#102247";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.font = "bold 12px Trebuchet MS, sans-serif";
  ctx.fillText(options.xLabel, pad.left + plotW / 2, height - 42);
  ctx.save();
  ctx.translate(18, pad.top + plotH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(options.yLabel, 0, 0);
  ctx.restore();

  let legendX = pad.left + plotW * 0.16;
  const legendY = height - 18;
  options.series.forEach((series) => {
    ctx.save();
    ctx.strokeStyle = series.color;
    ctx.lineWidth = 3;
    if (series.dashed) ctx.setLineDash([7, 5]);
    ctx.beginPath();
    ctx.moveTo(legendX, legendY);
    ctx.lineTo(legendX + 32, legendY);
    ctx.stroke();
    ctx.restore();
    ctx.fillStyle = "#14244a";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.font = "bold 12px Trebuchet MS, sans-serif";
    ctx.fillText(series.label, legendX + 42, legendY);
    legendX += Math.min(220, 58 + series.label.length * 8);
  });
}

export function createResultsGraphPoints(runs: PendulumRun[]) {
  const combined: Array<{ t: number; run1?: number; run2?: number; run3?: number }> = [];
  for (let t = 0; t <= 12; t += 0.04) {
    const point: { t: number; run1?: number; run2?: number; run3?: number } = { t };
    runs.forEach((run, index) => {
      const naturalOmega = Math.sqrt(GRAVITY / run.length);
      const nonlinearDrift = 1 + run.theta0 ** 2 / 16;
      point[`run${index + 1}` as "run1" | "run2" | "run3"] = run.theta0 * Math.cos((naturalOmega / nonlinearDrift) * t);
    });
    combined.push(point);
  }
  return combined;
}

export const liveGraphSeries = [
  { key: "numerical", label: "Numerical", color: "#6d32e8" },
  { key: "analytical", label: "Analytical", color: "#0aa8b3", dashed: true },
];

export const resultsGraphSeries = [
  { key: "run1", label: "Run 1", color: "#7937e8" },
  { key: "run2", label: "Run 2", color: "#0aa8b3" },
  { key: "run3", label: "Run 3", color: "#ff7b13" },
];
