import React from "react";
import { useApp } from "@/contexts/AppContext";
import { AlertTriangle, Clock, MessageSquareWarning, TrendingUp } from "lucide-react";

const KPICards: React.FC = () => {
  const { data, t } = useApp();
  const totalComplaints = data.complaints.filter(c => c.status === "Open" || c.status === "Acknowledged").length;
  const avgResponseHrs = 4.2;
  const riskFlags = data.socialNarratives.filter(n => n.sentiment === "negative").length;
  const totalAllocated = data.representatives.reduce((s, r) => s + r.budgetAllocated, 0);
  const totalUsed = data.representatives.reduce((s, r) => s + r.budgetUsed, 0);
  const utilPct = Math.round((totalUsed / totalAllocated) * 100);

  const cards = [
    { label: t("totalComplaints"), value: totalComplaints, icon: MessageSquareWarning, color: "text-destructive" },
    { label: t("avgResponseTime"), value: `${avgResponseHrs}h`, icon: Clock, color: "text-verified" },
    { label: t("activeRiskFlags"), value: riskFlags, icon: AlertTriangle, color: "text-amber-500" },
    { label: t("fundsUtilized"), value: `${utilPct}%`, icon: TrendingUp, color: "text-accent", ring: utilPct },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div key={i} className="card-gov flex items-start gap-4 cursor-pointer hover:shadow-md transition-shadow">
          <div className={`p-2.5 rounded-xl bg-secondary ${card.color}`}>
            <card.icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground font-medium">{card.label}</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
              {card.ring && (
                <svg width="32" height="32" viewBox="0 0 32 32" className="shrink-0">
                  <circle cx="16" cy="16" r="13" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
                  <circle cx="16" cy="16" r="13" fill="none" stroke="hsl(var(--accent))" strokeWidth="3"
                    strokeDasharray={`${card.ring * 0.817} 100`}
                    strokeLinecap="round" transform="rotate(-90 16 16)" />
                </svg>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;
