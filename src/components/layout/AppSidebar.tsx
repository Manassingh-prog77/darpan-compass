import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import {
  LayoutDashboard, Users, Wallet, MessageSquareWarning, BarChart3,
  Settings, HelpCircle, ChevronLeft, ChevronRight, Shield
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { key: "dashboard", path: "/dashboard", icon: LayoutDashboard },
  { key: "representatives", path: "/dashboard", icon: Users },
  { key: "budgets", path: "/budgets", icon: Wallet },
  { key: "grievances", path: "/grievances", icon: MessageSquareWarning },
  { key: "analytics", path: "/analytics", icon: BarChart3 },
  { key: "settings", path: "/settings", icon: Settings },
  { key: "help", path: "/dashboard", icon: HelpCircle },
];

const AppSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useApp();
  const location = useLocation();

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 z-30",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border shrink-0">
        <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
          <Shield className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>
        {!collapsed && <span className="text-lg font-bold tracking-tight">Darpan</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {navItems.map(item => {
          const active = location.pathname === item.path || 
            (item.key === "dashboard" && location.pathname === "/");
          return (
            <Link
              key={item.key}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
              title={t(item.key)}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{t(item.key)}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 border-t border-sidebar-border text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
};

export default AppSidebar;
