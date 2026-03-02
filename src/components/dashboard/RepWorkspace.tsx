import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { X, Shield, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import AIImageTab from "@/components/rep/AIImageTab";
import WorkTab from "@/components/rep/WorkTab";
import BudgetTab from "@/components/rep/BudgetTab";
import ComplaintsTab from "@/components/rep/ComplaintsTab";

const tabs = [
  { key: "ai", label: "AI Public Image" },
  { key: "work", label: "Work & To-Do" },
  { key: "budget", label: "Budget & Expenditure" },
  { key: "complaints", label: "Complaints" },
] as const;

const RepWorkspace: React.FC = () => {
  const { data, selectedRepId, selectRep, t } = useApp();
  const [activeTab, setActiveTab] = useState<string>("ai");

  const rep = data.representatives.find(r => r.id === selectedRepId);
  if (!rep) return null;

  const utilPct = Math.round((rep.budgetUsed / rep.budgetAllocated) * 100);
  const repComplaints = data.complaints.filter(c => c.repId === rep.id && (c.status === "Open" || c.status === "Acknowledged")).length;

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="card-gov space-y-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
            {rep.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">{rep.name}</h2>
            <p className="text-sm text-muted-foreground">{rep.role} • {rep.constituency}</p>
          </div>
        </div>
        <button onClick={() => selectRep(null)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors" aria-label="Close">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Quick KPIs */}
      <div className="flex gap-4">
        <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
          <TrendingUp className="w-4 h-4 text-accent" />
          <span className="text-sm font-semibold text-foreground">{rep.imageScore}</span>
          <span className="text-xs text-muted-foreground">Image Score</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
          <Shield className="w-4 h-4 text-verified" />
          <span className="text-sm font-semibold text-foreground">₹{(rep.budgetAllocated - rep.budgetUsed).toLocaleString("en-IN")}</span>
          <span className="text-xs text-muted-foreground">Balance</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
          <span className={cn("text-sm font-semibold", repComplaints > 10 ? "text-destructive" : "text-foreground")}>{repComplaints}</span>
          <span className="text-xs text-muted-foreground">Open</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
              activeTab === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
        {activeTab === "ai" && <AIImageTab repId={rep.id} />}
        {activeTab === "work" && <WorkTab repId={rep.id} />}
        {activeTab === "budget" && <BudgetTab repId={rep.id} />}
        {activeTab === "complaints" && <ComplaintsTab repId={rep.id} />}
      </motion.div>
    </motion.div>
  );
};

export default RepWorkspace;
