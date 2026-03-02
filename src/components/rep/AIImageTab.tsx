import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { TrendingUp, TrendingDown, AlertTriangle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const AIImageTab: React.FC<{ repId: string }> = ({ repId }) => {
  const { data } = useApp();
  const [showBrief, setShowBrief] = useState(false);
  const rep = data.representatives.find(r => r.id === repId)!;
  const narratives = data.socialNarratives.filter(n => n.repId === repId);

  const positive = narratives.filter(n => n.sentiment === "positive").length;
  const negative = narratives.filter(n => n.sentiment === "negative").length;
  const neutral = narratives.filter(n => n.sentiment === "neutral").length;
  const total = Math.max(narratives.length, 1);
  const posPct = Math.round((positive / total) * 100);
  const negPct = Math.round((negative / total) * 100);
  const neuPct = 100 - posPct - negPct;

  const riskLevel = negPct > 50 ? "High" : negPct > 25 ? "Medium" : "Low";

  return (
    <div className="space-y-5">
      {/* Score */}
      <div className="flex items-center gap-6">
        <div className="text-center">
          <p className={cn("text-5xl font-bold", rep.imageScore >= 75 ? "text-accent" : rep.imageScore >= 60 ? "text-foreground" : "text-destructive")}>
            {rep.imageScore}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Public Image Score</p>
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-16">Positive</span>
            <div className="flex-1 bg-secondary rounded-full h-2"><div className="bg-accent h-2 rounded-full" style={{ width: `${posPct}%` }} /></div>
            <span className="text-xs font-medium text-foreground w-10 text-right">{posPct}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-16">Neutral</span>
            <div className="flex-1 bg-secondary rounded-full h-2"><div className="bg-muted-foreground/40 h-2 rounded-full" style={{ width: `${neuPct}%` }} /></div>
            <span className="text-xs font-medium text-foreground w-10 text-right">{neuPct}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-16">Negative</span>
            <div className="flex-1 bg-secondary rounded-full h-2"><div className="bg-destructive h-2 rounded-full" style={{ width: `${negPct}%` }} /></div>
            <span className="text-xs font-medium text-foreground w-10 text-right">{negPct}%</span>
          </div>
        </div>
        <span className={cn(
          "text-xs font-semibold px-2.5 py-1 rounded-full",
          riskLevel === "High" ? "bg-destructive/10 text-destructive" :
          riskLevel === "Medium" ? "bg-amber-100 text-amber-700" : "bg-accent/10 text-accent"
        )}>{riskLevel} Risk</span>
      </div>

      {/* Narratives */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-foreground">Flagged Narratives</h4>
        {narratives.slice(0, 3).map(n => (
          <div key={n.id} className="flex items-start gap-3 p-3 bg-secondary rounded-xl">
            <div className={cn(
              "mt-0.5 shrink-0",
              n.sentiment === "negative" ? "text-destructive" : n.sentiment === "positive" ? "text-accent" : "text-muted-foreground"
            )}>
              {n.sentiment === "negative" ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground">"{n.excerpt}"</p>
              <p className="text-xs text-muted-foreground mt-1">{n.platform} • {n.date} • {n.occurrences || 1} occurrences</p>
            </div>
          </div>
        ))}
      </div>

      {/* Generate Brief */}
      <button onClick={() => setShowBrief(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
        <FileText className="w-4 h-4" /> Generate Brief
      </button>

      {showBrief && (
        <div className="fixed inset-0 bg-foreground/20 flex items-center justify-center z-50" onClick={() => setShowBrief(false)}>
          <div className="bg-card rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-foreground mb-3">AI-Generated Brief</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {rep.name} ({rep.constituency}) shows a public image score of {rep.imageScore}/100 with {negPct}% negative sentiment.
              Primary concerns revolve around {narratives.filter(n => n.sentiment === "negative")[0]?.excerpt || "pending projects"}.
              Recommended action: address top complaints within 48 hours to mitigate further score decline.
            </p>
            <button onClick={() => setShowBrief(false)} className="mt-4 px-4 py-2 bg-secondary rounded-lg text-sm font-medium text-foreground">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIImageTab;
