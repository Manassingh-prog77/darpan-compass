import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { motion } from "framer-motion";
import { Shield, CheckCircle, Vote, MessageCircle, MapPin, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CitizenInterface: React.FC = () => {
  const { citizenId, setCitizenId, data, updateData, addAuditEntry, addActivityEvent, t } = useApp();
  const [voterInput, setVoterInput] = useState("");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [complaintForm, setComplaintForm] = useState({ title: "", location: "", description: "" });

  // Voter verification
  if (!citizenId) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto mt-20 card-gov space-y-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Voter ID Verification</h1>
        <p className="text-sm text-muted-foreground">Enter your Voter ID to access the Citizen Portal. Your identity remains anonymous.</p>
        <input
          type="text"
          placeholder="Enter Voter ID (e.g., VOT-1234)"
          value={voterInput}
          onChange={e => setVoterInput(e.target.value)}
          className="w-full px-4 py-3 bg-secondary rounded-xl text-sm border-none outline-none focus:ring-2 focus:ring-ring/20 text-foreground placeholder:text-muted-foreground"
        />
        <button
          onClick={() => {
            if (voterInput.trim().length >= 3) {
              const anonId = `C-${Math.floor(1000 + Math.random() * 9000)}-xx`;
              setCitizenId(anonId);
              toast.success(`Verified! Anonymous ID: ${anonId}`);
            }
          }}
          disabled={voterInput.trim().length < 3}
          className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold disabled:opacity-50"
        >
          Verify & Continue
        </button>
      </motion.div>
    );
  }

  const handleSubmitComplaint = () => {
    if (!complaintForm.title.trim()) return;
    const newId = `comp-${Date.now()}`;
    updateData(d => ({
      ...d,
      complaints: [...d.complaints, {
        id: newId,
        repId: "rep-001", // auto-detect constituency mock
        title: complaintForm.title,
        status: "Open" as const,
        submitted: new Date().toISOString().split("T")[0],
        location: complaintForm.location || "Auto-detected",
        images: [],
        timeline: [{ event: "Submitted", time: new Date().toISOString() }],
      }],
    }));
    addAuditEntry(`Citizen:${citizenId}`, `Submitted complaint ${newId}`);
    addActivityEvent({
      text: `New citizen complaint: ${complaintForm.title}`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "Complaints",
    });
    toast.success(`Ticket ${newId} submitted`);
    setComplaintForm({ title: "", location: "", description: "" });
    setActiveSection(null);
  };

  const tasks = data.tasks.filter(t => t.status === "Completed" && t.publicValidation);
  const polls = data.polls;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="card-gov flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Citizen Portal</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-accent" />
            Verified • Anonymous ID: {citizenId}
          </p>
        </div>
        <div className="badge-verified"><Shield className="w-3 h-3" /> Verified</div>
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { key: "complaint", icon: FileText, label: t("reportComplaint"), color: "text-destructive" },
          { key: "verify", icon: CheckCircle, label: t("verifyWork"), color: "text-accent" },
          { key: "poll", icon: Vote, label: t("participateInPoll"), color: "text-verified" },
          { key: "ai", icon: MessageCircle, label: t("askAI"), color: "text-primary" },
        ].map(item => (
          <button
            key={item.key}
            onClick={() => setActiveSection(activeSection === item.key ? null : item.key)}
            className={cn(
              "card-gov flex items-center gap-3 text-left hover:shadow-md transition-shadow",
              activeSection === item.key && "ring-2 ring-primary/20"
            )}
          >
            <div className={cn("p-2 rounded-xl bg-secondary", item.color)}>
              <item.icon className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-foreground">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Report Complaint form */}
      {activeSection === "complaint" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-gov space-y-4">
          <h3 className="font-semibold text-foreground">Report a Complaint</h3>
          <input
            placeholder="Title / Subject"
            value={complaintForm.title}
            onChange={e => setComplaintForm(f => ({ ...f, title: e.target.value }))}
            className="w-full px-4 py-2.5 bg-secondary rounded-xl text-sm outline-none text-foreground placeholder:text-muted-foreground"
          />
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <input
              placeholder="Location (auto-detected)"
              value={complaintForm.location}
              onChange={e => setComplaintForm(f => ({ ...f, location: e.target.value }))}
              className="flex-1 px-3 py-2 bg-secondary rounded-xl text-sm outline-none text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <textarea
            placeholder="Description (optional)"
            value={complaintForm.description}
            onChange={e => setComplaintForm(f => ({ ...f, description: e.target.value }))}
            rows={3}
            className="w-full px-4 py-2.5 bg-secondary rounded-xl text-sm outline-none resize-none text-foreground placeholder:text-muted-foreground"
          />
          <div className="flex gap-2">
            <button onClick={handleSubmitComplaint} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">{t("submit")}</button>
            <button onClick={() => setActiveSection(null)} className="px-4 py-2 bg-secondary text-foreground rounded-lg text-sm font-medium">{t("cancel")}</button>
          </div>
        </motion.div>
      )}

      {/* Verify Work */}
      {activeSection === "verify" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-gov space-y-3">
          <h3 className="font-semibold text-foreground">Verify Completed Work</h3>
          {tasks.map(task => (
            <div key={task.id} className="flex items-center justify-between p-3 bg-secondary rounded-xl">
              <div>
                <p className="text-sm font-medium text-foreground">{task.title}</p>
                <p className="text-xs text-muted-foreground">{task.publicValidation!.confirmed}% confirmed • {task.publicValidation!.responses} votes</p>
              </div>
              <div className="flex gap-1">
                <button className="text-xs px-3 py-1.5 bg-accent text-accent-foreground rounded-md font-medium">Confirm</button>
                <button className="text-xs px-3 py-1.5 bg-destructive/10 text-destructive rounded-md font-medium">Dispute</button>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Polls */}
      {activeSection === "poll" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-gov space-y-3">
          <h3 className="font-semibold text-foreground">Active Polls</h3>
          {polls.map(poll => {
            const total = poll.options.reduce((s, o) => s + o.count, 0);
            return (
              <div key={poll.id} className="p-3 bg-secondary rounded-xl space-y-2">
                <p className="text-sm font-medium text-foreground">{poll.question}</p>
                {poll.options.map(opt => (
                  <button key={opt.label} className="w-full flex items-center gap-2 px-3 py-2 bg-card rounded-lg hover:bg-muted transition-colors">
                    <span className="text-sm text-foreground flex-1 text-left">{opt.label}</span>
                    <span className="text-xs text-muted-foreground">{Math.round((opt.count / total) * 100)}%</span>
                  </button>
                ))}
              </div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
};

export default CitizenInterface;
