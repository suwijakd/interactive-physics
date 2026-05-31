type RangeControlProps = {
  label: string;
  icon: string;
  value: number;
  min: number;
  max: number;
  step: number;
  displayValue: string;
  accent?: "purple" | "teal" | "orange" | "blue";
  onChange: (value: number) => void;
};

export function RangeControl({
  label,
  icon,
  value,
  min,
  max,
  step,
  displayValue,
  accent = "purple",
  onChange,
}: RangeControlProps) {
  return (
    <div className="slider-block">
      <div className={`slider-icon ${accent}`}>{icon}</div>
      <div>
        <div className="slider-top">
          <label>
            {label}
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(event) => onChange(Number(event.target.value))}
            />
          </label>
          <output className="value-pill">{displayValue}</output>
        </div>
        <div className="range-minmax">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  );
}
