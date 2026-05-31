import type { PropsWithChildren } from "react";

type PanelProps = PropsWithChildren<{
  className?: string;
  ariaLabel?: string;
}>;

export function Panel({ children, className = "", ariaLabel }: PanelProps) {
  return (
    <section className={`panel ${className}`} aria-label={ariaLabel}>
      {children}
    </section>
  );
}
