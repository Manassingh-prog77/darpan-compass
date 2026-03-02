import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { CheckCircle, AlertTriangle, Clock, Shield, Lock, Sliders } from "lucide-react";
import { cn } from "@/lib/utils";

const BudgetTab: React.FC<{ repId: string }> = ({ repId }) => {
  const { data, updateData, addAuditEntry, addActivityEvent, role } = useApp();
  const rep = data.representatives.find(r => r.id === repId)!;
  const expenses = data.expenses.filter(e => e.repId === repId);
  const utilPct = Math.round((rep.budgetUsed / rep.budgetAllocated) * 100);

  const [showAllocator, setShowAllocator] = useState(false);
  const [weights, setWeights] = useState({ w1: 0.4, w2: 0.3, w3: 0.3 });

  const handleVerify = (expId: string) => {
    updateData(d => ({
      ...d,
      expenses: d.expenses.map(e => e.id === expId ? { ...e, status: "Verified" as const } : e),
    }));
    addAuditEntry(role, `Verified expense ${expId}`);
    addActivityEvent({
      text: `Expense ${expId} verified by ${role}`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "Budget", repId,
    });
  };

  const handleDispute = (expId: string) => {
    updateData(d => ({
      ...d,
      expenses: d.expenses.map(e => e.id === expId ? { ...e, status: "Disputed" as const } : e),
    }));
    addAuditEntry(role, `Disputed expense ${expId}`);
  };

  // Smart Budget Allocator
  const runAllocator = () => {
    const reps = data.representatives;
    const maxComplaints = Math.max(...reps.map(r => r.openComplaints));
    const maxPop = Math.max(...reps.map(r => r.population));
    const totalFund = reps.reduce((s, r) => s + r.budgetAllocated, 0);

    const scores = reps.map(r => {
      const cn = r.openComplaints / (maxComplaints || 1);
      const bu = 1 - (r.budgetUsed / (r.budgetAllocated || 1));
      const pn = r.population / (maxPop || 1);
      return { id: r.id, score: weights.w1 * cn + weights.w2 * bu + weights.w3 * pn, name: r.name, constituency: r.constituency };
    });
    const totalScore = scores.reduce((s, x) => s + x.score, 0);
    return scores.map(s => ({
      ...s,
      allocated: Math.round((s.score / totalScore) * totalFund),
      pct: Math.round((s.score / totalScore) * 100),
    }));
  };

  return (
    <div className="space-y-5">
      {/* Top tiles */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-secondary rounded-xl p-3 text-center">
          <p className="text-xs text-muted-foreground">Total Allocated</p>
          <p className="text-lg font-bold text-foreground">₹{rep.budgetAllocated.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-secondary rounded-xl p-3 text-center">
          <p className="text-xs text-muted-foreground">Utilized</p>
          <p className="text-lg font-bold text-foreground">₹{rep.budgetUsed.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-secondary rounded-xl p-3 text-center flex flex-col items-center">
          <p className="text-xs text-muted-foreground">Balance</p>
          <div className="flex items-center gap-2">
            <p className="text-lg font-bold text-foreground">₹{(rep.budgetAllocated - rep.budgetUsed).toLocaleString("en-IN")}</p>
            <svg width="28" height="28" viewBox="0 0 28 28">
              <circle cx="14" cy="14" r="11" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
              <circle cx="14" cy="14" r="11" fill="none" stroke="hsl(var(--accent))" strokeWidth="3"
                strokeDasharray={`${utilPct * 0.691} 100`} strokeLinecap="round" transform="rotate(-90 14 14)" />
            </svg>
          </div>
        </div>
      </div>

      {/* Expense table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b border-border">
              <th className="pb-2 font-medium">Date</th>
              <th className="pb-2 font-medium">Category</th>
              <th className="pb-2 font-medium">Amount</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(exp => (
              <tr key={exp.id} className="border-b border-border/50 hover:bg-secondary/50">
                <td className="py-2.5 text-foreground">{exp.date}</td>
                <td className="py-2.5 text-foreground">{exp.category}</td>
                <td className="py-2.5 font-medium text-foreground">₹{exp.amount.toLocaleString("en-IN")}</td>
                <td className="py-2.5">
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1",
                    exp.status === "Verified" ? "bg-accent/10 text-accent" :
                    exp.status === "Disputed" ? "bg-destructive/10 text-destructive" :
                    "bg-secondary text-muted-foreground"
                  )}>
                    {exp.status === "Verified" && <CheckCircle className="w-3 h-3" />}
                    {exp.status === "Disputed" && <AlertTriangle className="w-3 h-3" />}
                    {exp.status === "Pending" && <Clock className="w-3 h-3" />}
                    {exp.status}
                  </span>
                </td>
                <td className="py-2.5">
                  <div className="flex gap-1">
                    {exp.status === "Pending" && role !== "Citizen" && (
                      <>
                        <button onClick={() => handleVerify(exp.id)} className="text-[11px] px-2 py-1 bg-accent text-accent-foreground rounded-md font-medium flex items-center gap-1">
                          <Shield className="w-3 h-3" /> Approve
                        </button>
                        <button onClick={() => handleDispute(exp.id)} className="text-[11px] px-2 py-1 bg-destructive/10 text-destructive rounded-md font-medium">Dispute</button>
                      </>
                    )}
                    <span title="E2E encrypted"><Lock className="w-3 h-3 text-muted-foreground" /></span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Smart Budget Allocator */}
      <div className="border-t border-border pt-4">
        <button onClick={() => setShowAllocator(!showAllocator)} className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
          <Sliders className="w-4 h-4" /> Smart Budget Allocator
        </button>
      </div>

      {showAllocator && (
        <div className="bg-secondary rounded-xl p-4 space-y-4">
          <p className="text-xs text-muted-foreground">Adjust weights to see how allocation changes:</p>
          {[
            { key: "w1" as const, label: "Complaint Priority" },
            { key: "w2" as const, label: "Budget Headroom" },
            { key: "w3" as const, label: "Population Weight" },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center gap-3">
              <span className="text-xs text-foreground w-32">{label}</span>
              <input type="range" min="0" max="100" value={weights[key] * 100}
                onChange={e => setWeights(w => ({ ...w, [key]: parseInt(e.target.value) / 100 }))}
                className="flex-1 accent-primary" />
              <span className="text-xs font-mono text-muted-foreground w-10">{(weights[key] * 100).toFixed(0)}%</span>
            </div>
          ))}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="text-muted-foreground border-b border-border"><th className="pb-1 text-left">Rep</th><th className="pb-1 text-left">Constituency</th><th className="pb-1 text-right">Allocated</th><th className="pb-1 text-right">Share</th></tr></thead>
              <tbody>
                {runAllocator().map(r => (
                  <tr key={r.id} className="border-b border-border/30">
                    <td className="py-1.5 text-foreground">{r.name}</td>
                    <td className="py-1.5 text-muted-foreground">{r.constituency}</td>
                    <td className="py-1.5 text-right font-medium text-foreground">₹{r.allocated.toLocaleString("en-IN")}</td>
                    <td className="py-1.5 text-right text-muted-foreground">{r.pct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetTab;
