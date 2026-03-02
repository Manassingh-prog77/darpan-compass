import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Search, Bell, Globe, Play, Square, User } from "lucide-react";
import { cn } from "@/lib/utils";

const roles = [
  { value: "PartyHead" as const, label: "Party Head" },
  { value: "MP" as const, label: "State Admin / MP" },
  { value: "Citizen" as const, label: "Citizen" },
];
const languages = [
  { value: "en" as const, label: "EN" },
  { value: "hi" as const, label: "HI" },
  { value: "te" as const, label: "TE" },
];

const TopBar: React.FC = () => {
  const { role, setRole, lang, setLang, t, activityFeed, presenterMode, setPresenterMode } = useApp();
  const [showNotif, setShowNotif] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4 gap-4 sticky top-0 z-20" style={{ boxShadow: "0 1px 3px rgba(11,59,96,0.04)" }}>
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={t("search")}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-secondary rounded-lg text-sm border-none outline-none focus:ring-2 focus:ring-ring/20 placeholder:text-muted-foreground"
          aria-label="Search"
        />
      </div>

      <div className="flex items-center gap-3">
        {/* Presenter Mode */}
        <button
          onClick={() => setPresenterMode(!presenterMode)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
            presenterMode
              ? "bg-accent text-accent-foreground"
              : "bg-secondary text-muted-foreground hover:text-foreground"
          )}
          aria-label="Toggle presenter mode"
        >
          {presenterMode ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          {presenterMode ? "Stop" : "Present"}
        </button>

        {/* Role selector */}
        <select
          value={role}
          onChange={e => setRole(e.target.value as any)}
          className="bg-secondary text-sm px-3 py-1.5 rounded-lg border-none outline-none cursor-pointer font-medium text-foreground"
          aria-label="Select role"
        >
          {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>

        {/* Language toggle */}
        <div className="flex items-center bg-secondary rounded-lg overflow-hidden">
          {languages.map(l => (
            <button
              key={l.value}
              onClick={() => setLang(l.value)}
              className={cn(
                "px-2.5 py-1.5 text-xs font-semibold transition-colors",
                lang === l.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Globe className="w-3 h-3 inline mr-1" />{l.label}
            </button>
          ))}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground rounded-full text-[10px] flex items-center justify-center font-bold">
              {activityFeed.length > 9 ? "9+" : activityFeed.length}
            </span>
          </button>
          {showNotif && (
            <div className="absolute right-0 top-12 w-80 bg-card border border-border rounded-xl shadow-lg p-3 space-y-2 max-h-80 overflow-y-auto animate-fade-in z-50">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("notifications")}</h4>
              {activityFeed.slice(0, 8).map(ev => (
                <div key={ev.id} className="text-sm py-2 border-b border-border last:border-0">
                  <p className="text-foreground">{ev.text}</p>
                  <span className="text-xs text-muted-foreground">{ev.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <User className="w-4 h-4 text-primary-foreground" />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
