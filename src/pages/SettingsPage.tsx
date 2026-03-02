import React from "react";
import { useApp } from "@/contexts/AppContext";
import { motion } from "framer-motion";
import { Download, Shield, Lock } from "lucide-react";

const SettingsPage: React.FC = () => {
  const { data, t } = useApp();

  const handleExportCSV = () => {
    const headers = "ID,Actor,Action,Timestamp\n";
    const rows = data.auditLog.map(e => `${e.id},${e.actor},"${e.action}",${e.timestamp}`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "audit-log.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl space-y-6">
      <h1 className="text-xl font-bold text-foreground">{t("settings")}</h1>

      {/* Audit Log */}
      <div className="card-gov space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5 text-verified" /> {t("auditLog")}
          </h2>
          <button onClick={handleExportCSV} className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium">
            <Download className="w-3 h-3" /> {t("exportCSV")}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border">
                <th className="pb-2 font-medium">Timestamp</th>
                <th className="pb-2 font-medium">Actor</th>
                <th className="pb-2 font-medium">Action</th>
                <th className="pb-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {data.auditLog.slice().reverse().map(entry => (
                <tr key={entry.id} className="border-b border-border/50">
                  <td className="py-2.5 text-muted-foreground text-xs">{new Date(entry.timestamp).toLocaleString()}</td>
                  <td className="py-2.5 text-foreground font-medium">{entry.actor}</td>
                  <td className="py-2.5 text-foreground">{entry.action}</td>
                  <td className="py-2.5"><span title="Immutable record"><Lock className="w-3 h-3 text-muted-foreground" /></span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.auditLog.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No audit entries yet</p>
        )}
      </div>

      {/* RBAC info */}
      <div className="card-gov space-y-3">
        <h2 className="text-base font-semibold text-foreground">Role-Based Access Control</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { role: "Party Head", perms: "Full access, verify expenses, manage hierarchy, view all analytics" },
            { role: "MP / State Admin", perms: "View own constituency, manage tasks, submit expenses, respond to complaints" },
            { role: "Citizen", perms: "Submit complaints, verify work, participate in polls, ask AI" },
          ].map(r => (
            <div key={r.role} className="p-3 bg-secondary rounded-xl">
              <p className="text-sm font-semibold text-foreground">{r.role}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.perms}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
