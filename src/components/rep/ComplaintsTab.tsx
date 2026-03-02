import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { MapPin, ArrowUpRight, ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  Open: "status-open",
  Acknowledged: "status-acknowledged",
  Responded: "status-responded",
  Resolved: "status-resolved",
  Overdue: "status-overdue",
};

const ComplaintsTab: React.FC<{ repId: string }> = ({ repId }) => {
  const { data, updateData, addAuditEntry, addActivityEvent, role } = useApp();
  const complaints = data.complaints.filter(c => c.repId === repId);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = complaints.find(c => c.id === selectedId);

  const handleEscalate = (compId: string) => {
    updateData(d => ({
      ...d,
      complaints: d.complaints.map(c => c.id === compId ? {
        ...c,
        status: "Acknowledged" as const,
        timeline: [...(c.timeline || []), { event: "Escalated to leadership", time: new Date().toISOString() }],
      } : c),
    }));
    addAuditEntry(role, `Escalated complaint ${compId}`);
    addActivityEvent({
      text: `Complaint ${compId} escalated to leadership`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "Complaints", repId,
    });
  };

  return (
    <div className="space-y-3">
      {!selected ? (
        complaints.map(c => (
          <div
            key={c.id}
            onClick={() => setSelectedId(c.id)}
            className="flex items-start gap-3 p-3 bg-secondary rounded-xl cursor-pointer hover:bg-muted transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={statusStyles[c.status]}>{c.status}</span>
                <span className="text-[10px] text-muted-foreground">{c.id}</span>
              </div>
              <p className="text-sm font-medium text-foreground">{c.title}</p>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.location}</span>
                <span>{c.submitted}</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground mt-2" />
          </div>
        ))
      ) : (
        <div className="space-y-4">
          <button onClick={() => setSelectedId(null)} className="text-xs text-verified hover:underline">← Back to list</button>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={statusStyles[selected.status]}>{selected.status}</span>
              <span className="text-xs text-muted-foreground">{selected.id}</span>
            </div>
            <h4 className="text-base font-semibold text-foreground">{selected.title}</h4>
            <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
              <MapPin className="w-3 h-3" />{selected.location} • {selected.submitted}
            </p>
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Timeline</h5>
            {(selected.timeline || []).map((t, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-verified shrink-0" />
                <span className="text-foreground">{t.event}</span>
                <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
                  <Clock className="w-3 h-3" />{new Date(t.time).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>

          {/* SLA timer */}
          <div className="bg-secondary rounded-lg p-3">
            <p className="text-xs text-muted-foreground">SLA Timer</p>
            <p className={cn("text-sm font-semibold", selected.status === "Open" ? "text-destructive" : "text-foreground")}>
              {selected.status === "Open" || selected.status === "Acknowledged"
                ? `${Math.max(1, Math.floor((Date.now() - new Date(selected.submitted).getTime()) / 86400000))} days elapsed`
                : "Resolved"
              }
            </p>
          </div>

          {/* Actions */}
          {selected.status !== "Resolved" && (
            <button
              onClick={() => handleEscalate(selected.id)}
              className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium"
            >
              <ArrowUpRight className="w-4 h-4" /> Escalate
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ComplaintsTab;
