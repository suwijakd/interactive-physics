import type { RefObject } from "react";

type CanvasSurfaceProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  className?: string;
  ariaLabel: string;
};

export function CanvasSurface({ canvasRef, className = "", ariaLabel }: CanvasSurfaceProps) {
  return <canvas ref={canvasRef} className={className} aria-label={ariaLabel} />;
}
