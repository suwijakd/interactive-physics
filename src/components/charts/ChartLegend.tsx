type ChartLegendProps = {
  items: Array<{ label: string; color: string; dashed?: boolean }>;
};

export function ChartLegend({ items }: ChartLegendProps) {
  return (
    <div className="chart-legend">
      {items.map((item) => (
        <span key={item.label}>
          <i style={{ backgroundColor: item.color, borderTopStyle: item.dashed ? "dashed" : "solid" }} />
          {item.label}
        </span>
      ))}
    </div>
  );
}
