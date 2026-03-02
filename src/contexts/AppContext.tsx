import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { initialMockData, MockData, AuditEntry, Complaint, i18n } from "@/data/mock-data";

type Role = "PartyHead" | "MP" | "Citizen";
type Lang = "en" | "hi" | "te";

interface ActivityEvent {
  id: string; text: string; time: string; type: "AI" | "Budget" | "Complaints" | "Tasks";
  repId?: string;
}

interface AppState {
  data: MockData;
  role: Role;
  lang: Lang;
  selectedRepId: string | null;
  activityFeed: ActivityEvent[];
  citizenId: string | null;
  presenterMode: boolean;
}

interface AppContextType extends AppState {
  setRole: (r: Role) => void;
  setLang: (l: Lang) => void;
  selectRep: (id: string | null) => void;
  t: (key: string) => string;
  updateData: (updater: (d: MockData) => MockData) => void;
  addAuditEntry: (actor: string, action: string) => void;
  addActivityEvent: (e: Omit<ActivityEvent, "id">) => void;
  setCitizenId: (id: string) => void;
  setPresenterMode: (v: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<MockData>(() => {
    const saved = localStorage.getItem("darpan-data");
    return saved ? JSON.parse(saved) : initialMockData;
  });
  const [role, setRole] = useState<Role>("PartyHead");
  const [lang, setLang] = useState<Lang>("en");
  const [selectedRepId, selectRep] = useState<string | null>(null);
  const [activityFeed, setActivityFeed] = useState<ActivityEvent[]>([
    { id: "init-1", text: "AI flagged negative narrative for Priya Rao (Hyderabad)", time: "8:34 AM", type: "AI", repId: "rep-002" },
    { id: "init-2", text: "Budget expense exp-2001 pending approval — Anand Singh", time: "9:12 AM", type: "Budget", repId: "rep-001" },
    { id: "init-3", text: "New complaint submitted: Drainage overflow - Ward 12", time: "9:45 AM", type: "Complaints", repId: "rep-002" },
    { id: "init-4", text: "Task completed: Road repair near Sector 4 — Anand Singh", time: "10:00 AM", type: "Tasks", repId: "rep-001" },
  ]);
  const [citizenId, setCitizenIdState] = useState<string | null>(() => localStorage.getItem("darpan-citizen-id"));
  const [presenterMode, setPresenterMode] = useState(false);

  const feedRef = useRef(activityFeed);
  feedRef.current = activityFeed;

  useEffect(() => { localStorage.setItem("darpan-data", JSON.stringify(data)); }, [data]);

  const t = useCallback((key: string) => {
    return i18n[lang]?.[key] ?? i18n.en?.[key] ?? key;
  }, [lang]);

  const updateData = useCallback((updater: (d: MockData) => MockData) => {
    setData(prev => updater(prev));
  }, []);

  const addAuditEntry = useCallback((actor: string, action: string) => {
    const entry: AuditEntry = {
      id: `a-${Date.now()}`, actor, action, timestamp: new Date().toISOString(),
    };
    updateData(d => ({ ...d, auditLog: [...d.auditLog, entry] }));
  }, [updateData]);

  const addActivityEvent = useCallback((e: Omit<ActivityEvent, "id">) => {
    setActivityFeed(prev => [{ ...e, id: `ev-${Date.now()}` }, ...prev].slice(0, 50));
  }, []);

  const setCitizenId = useCallback((id: string) => {
    setCitizenIdState(id);
    localStorage.setItem("darpan-citizen-id", id);
  }, []);

  // Simulated background AI worker
  useEffect(() => {
    const interval = setInterval(() => {
      const reps = data.representatives;
      const randomRep = reps[Math.floor(Math.random() * reps.length)];
      const delta = Math.random() > 0.5 ? Math.floor(Math.random() * 3) + 1 : -(Math.floor(Math.random() * 3) + 1);
      const newScore = Math.max(0, Math.min(100, randomRep.imageScore + delta));
      updateData(d => ({
        ...d,
        representatives: d.representatives.map(r =>
          r.id === randomRep.id ? { ...r, imageScore: newScore } : r
        ),
      }));
      if (Math.abs(delta) >= 2) {
        addActivityEvent({
          text: `AI image score ${delta > 0 ? "▲" : "▼"} for ${randomRep.name} (${randomRep.constituency}) — now ${newScore}`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "AI",
          repId: randomRep.id,
        });
      }
    }, 15000 + Math.random() * 10000);
    return () => clearInterval(interval);
  }, [data.representatives, updateData, addActivityEvent]);

  return (
    <AppContext.Provider value={{
      data, role, lang, selectedRepId, activityFeed, citizenId, presenterMode,
      setRole, setLang, selectRep, t, updateData, addAuditEntry, addActivityEvent,
      setCitizenId, setPresenterMode,
    }}>
      {children}
    </AppContext.Provider>
  );
};
