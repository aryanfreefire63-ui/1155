interface SearchFunnelProps {
  title?: string;
}

export function SearchFunnel({ title = "Organic search funnel" }: SearchFunnelProps) {
  const funnelData = [
    { label: "Sessions", value: "34,842", percentage: "34%", color: "bg-primary" },
    { label: "Users", value: "30,834", percentage: "12%", color: "bg-primary/80" },
    { label: "Goal completions", value: "27,904", percentage: "28%", color: "bg-primary/60" },
  ];

  return (
    <div className="bg-card rounded-xl p-5 card-shadow border border-border animate-fade-in">
      <h3 className="font-semibold text-foreground mb-4">{title}</h3>
      
      <div className="space-y-4 mb-6">
        {funnelData.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${item.color}`} />
            <span className="text-sm text-muted-foreground flex-1">{item.label}</span>
            <span className="font-semibold text-foreground">{item.value}</span>
            <span className="text-sm text-success">({item.percentage})</span>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total conversion rate</span>
          <span className="font-semibold text-primary text-lg">13.83%</span>
        </div>
      </div>

      {/* Visual Funnel */}
      <div className="mt-4 flex flex-col items-end gap-1">
        <div className="h-10 bg-primary rounded-l-lg" style={{ width: "100%" }} />
        <div className="h-10 bg-primary/80 rounded-l-lg" style={{ width: "85%" }} />
        <div className="h-10 bg-primary/60 rounded-l-lg" style={{ width: "70%" }} />
      </div>
    </div>
  );
}
