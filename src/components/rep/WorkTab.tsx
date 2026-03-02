import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { CheckCircle, Clock, Circle, Upload, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig = {
  Pending: { icon: Circle, color: "text-muted-foreground", bg: "bg-secondary" },
  "In Progress": { icon: Clock, color: "text-verified", bg: "bg-verified/10" },
  Completed: { icon: CheckCircle, color: "text-accent", bg: "bg-accent/10" },
};

const WorkTab: React.FC<{ repId: string }> = ({ repId }) => {
  const { data, updateData, addAuditEntry, addActivityEvent, role } = useApp();
  const tasks = data.tasks.filter(t => t.repId === repId);
  const [showUpload, setShowUpload] = useState<string | null>(null);

  const columns: Array<"Pending" | "In Progress" | "Completed"> = ["Pending", "In Progress", "Completed"];

  const handleStatusChange = (taskId: string, newStatus: "Pending" | "In Progress" | "Completed") => {
    updateData(d => ({
      ...d,
      tasks: d.tasks.map(t => t.id === taskId ? {
        ...t,
        status: newStatus,
        completed: newStatus === "Completed" ? new Date().toISOString().split("T")[0] : t.completed,
      } : t),
    }));
    addAuditEntry(role, `Changed task ${taskId} to ${newStatus}`);
    addActivityEvent({
      text: `Task ${taskId} marked as ${newStatus}`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "Tasks", repId,
    });
    if (newStatus === "Completed") setShowUpload(taskId);
  };

  const handleVerify = (taskId: string) => {
    updateData(d => ({
      ...d,
      tasks: d.tasks.map(t => t.id === taskId ? {
        ...t,
        publicValidation: { confirmed: 100, disputed: 0, responses: (t.publicValidation?.responses || 0) + 1 },
      } : t),
    }));
    addAuditEntry(role, `Verified task ${taskId}`);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {columns.map(col => {
          const colTasks = tasks.filter(t => t.status === col);
          const cfg = statusConfig[col];
          return (
            <div key={col} className="space-y-2">
              <div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg", cfg.bg)}>
                <cfg.icon className={cn("w-4 h-4", cfg.color)} />
                <span className="text-xs font-semibold text-foreground">{col}</span>
                <span className="text-xs text-muted-foreground ml-auto">{colTasks.length}</span>
              </div>
              {colTasks.map(task => (
                <div key={task.id} className="p-3 bg-secondary rounded-xl space-y-2 text-sm">
                  <p className="font-medium text-foreground">{task.title}</p>
                  <p className="text-xs text-muted-foreground">Assigned: {task.assigned}</p>
                  {task.assignedBy && <p className="text-[10px] text-muted-foreground">By: {task.assignedBy}</p>}
                  {task.publicValidation && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-card rounded-full h-1.5">
                        <div className="bg-accent h-1.5 rounded-full" style={{ width: `${task.publicValidation.confirmed}%` }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{task.publicValidation.confirmed}% confirmed</span>
                    </div>
                  )}
                  <div className="flex gap-1 flex-wrap">
                    {col !== "Completed" && (
                      <button
                        onClick={() => handleStatusChange(task.id, col === "Pending" ? "In Progress" : "Completed")}
                        className="text-[11px] px-2 py-1 bg-primary text-primary-foreground rounded-md font-medium"
                      >
                        {col === "Pending" ? "Start" : "Complete"}
                      </button>
                    )}
                    {col === "Completed" && role === "PartyHead" && (
                      <button
                        onClick={() => handleVerify(task.id)}
                        className="text-[11px] px-2 py-1 bg-accent text-accent-foreground rounded-md font-medium flex items-center gap-1"
                      >
                        <Shield className="w-3 h-3" /> Mark Verified
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Upload modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-foreground/20 flex items-center justify-center z-50" onClick={() => setShowUpload(null)}>
          <div className="bg-card rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Upload className="w-5 h-5" /> Upload Proof
            </h3>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
              <p className="text-sm text-muted-foreground">Drop files here or click to upload</p>
              <p className="text-xs text-muted-foreground mt-1">Images, documents (mock upload)</p>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  updateData(d => ({
                    ...d,
                    tasks: d.tasks.map(t => t.id === showUpload ? { ...t, proofs: [...t.proofs, "/mock/proof_new.jpg"] } : t),
                  }));
                  setShowUpload(null);
                }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
              >Upload (Mock)</button>
              <button onClick={() => setShowUpload(null)} className="px-4 py-2 bg-secondary rounded-lg text-sm font-medium text-foreground">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkTab;
