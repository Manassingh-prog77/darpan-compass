import React from "react";
import { useApp } from "@/contexts/AppContext";
import { motion } from "framer-motion";
import KPICards from "@/components/dashboard/KPICards";
import HierarchyTree from "@/components/dashboard/HierarchyTree";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import RepWorkspace from "@/components/dashboard/RepWorkspace";

const Dashboard: React.FC = () => {
  const { selectedRepId } = useApp();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <KPICards />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <HierarchyTree />
        </div>
        <div className="lg:col-span-8">
          {selectedRepId ? <RepWorkspace /> : <ActivityFeed />}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
