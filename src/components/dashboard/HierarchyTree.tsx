import React from "react";
import { useApp } from "@/contexts/AppContext";
import { ChevronDown, ChevronRight, User } from "lucide-react";
import { cn } from "@/lib/utils";

const HierarchyTree: React.FC = () => {
  const { data, selectedRepId, selectRep } = useApp();
  const [expanded, setExpanded] = React.useState(true);

  const mps = data.representatives.filter(r => r.role === "MP");
  const workers = data.representatives.filter(r => r.role === "Worker");

  return (
    <div className="card-gov space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Hierarchy</h3>

      {/* Party Head */}
      <div className="space-y-1">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 w-full text-left px-2 py-2 rounded-lg hover:bg-secondary transition-colors"
        >
          {expanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <span className="text-sm font-semibold">Party Head</span>
            <span className="text-xs text-muted-foreground ml-2">National</span>
          </div>
        </button>

        {expanded && (
          <div className="ml-6 border-l-2 border-border pl-4 space-y-1">
            {mps.map(rep => (
              <div key={rep.id}>
                <button
                  onClick={() => selectRep(rep.id === selectedRepId ? null : rep.id)}
                  className={cn(
                    "flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg transition-colors text-sm",
                    selectedRepId === rep.id
                      ? "bg-verified/10 border border-verified/30"
                      : "hover:bg-secondary"
                  )}
                >
                  <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">
                    {rep.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{rep.name}</p>
                    <p className="text-xs text-muted-foreground">{rep.constituency} • {rep.role}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={cn("text-xs font-semibold", rep.imageScore >= 75 ? "text-accent" : rep.imageScore >= 60 ? "text-amber-500" : "text-destructive")}>
                      {rep.imageScore}
                    </p>
                    {rep.openComplaints > 0 && (
                      <span className="text-[10px] bg-destructive/10 text-destructive px-1.5 py-0.5 rounded-full">{rep.openComplaints}</span>
                    )}
                  </div>
                </button>
                {/* Workers under this MP region */}
                {workers.filter(w => {
                  // Simple association for demo
                  const idx = mps.indexOf(rep);
                  const wIdx = workers.indexOf(w);
                  return wIdx === idx || (idx === 0 && wIdx >= workers.length);
                }).length > 0 && selectedRepId === rep.id && (
                  <div className="ml-6 border-l border-border pl-3 mt-1 space-y-1">
                    {workers.slice(0, 1).map(w => (
                      <button
                        key={w.id}
                        onClick={() => selectRep(w.id)}
                        className="flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-lg hover:bg-secondary text-xs"
                      >
                        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-[10px] font-bold">
                          {w.name.charAt(0)}
                        </div>
                        <span className="text-muted-foreground">{w.name} • {w.constituency}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {/* Show workers separately */}
            <div className="pt-2">
              <p className="text-xs text-muted-foreground font-semibold mb-1 px-3">Workers</p>
              {workers.map(w => (
                <button
                  key={w.id}
                  onClick={() => selectRep(w.id === selectedRepId ? null : w.id)}
                  className={cn(
                    "flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg transition-colors text-sm",
                    selectedRepId === w.id
                      ? "bg-verified/10 border border-verified/30"
                      : "hover:bg-secondary"
                  )}
                >
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xs font-bold">
                    {w.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate text-xs">{w.name}</p>
                    <p className="text-[10px] text-muted-foreground">{w.constituency}</p>
                  </div>
                  <span className={cn("text-xs font-semibold", w.imageScore >= 75 ? "text-accent" : "text-amber-500")}>{w.imageScore}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HierarchyTree;
