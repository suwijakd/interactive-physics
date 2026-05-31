type BadgeMedalProps = {
  label: string;
  tone?: "purple" | "teal" | "green" | "orange";
  size?: "small" | "large";
};

export function BadgeMedal({ label, tone = "purple", size = "small" }: BadgeMedalProps) {
  return <div className={`badge-medal ${tone} ${size}`}>{label}</div>;
}
