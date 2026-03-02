import React from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import TopBar from "./TopBar";
import AIAvatarWidget from "@/components/ai/AIAvatarWidget";

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
      <AIAvatarWidget />
    </div>
  );
};

export default AppLayout;
