import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";

const filterTypes = ["All", "AI", "Budget", "Complaints", "Tasks"] as const;

const ActivityFeed: React.FC = () => {
  const { activityFeed, selectRep } = useApp();
  const [filter, setFilter] = useState<string>("All");

  const filtered = filter === "All" ? activityFeed : activityFeed.filter(e => e.type === filter);

  return (
    <div className="card-gov space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Activity Feed</h3>
        <div className="flex gap-1">
          {filterTypes.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "text-xs px-2.5 py-1 rounded-full transition-colors font-medium",
                filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filtered.map(ev => (
          <div
            key={ev.id}
            className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
            onClick={() => ev.repId && selectRep(ev.repId)}
          >
            <div className={cn(
              "w-2 h-2 rounded-full mt-2 shrink-0",
              ev.type === "AI" ? "bg-verified" : ev.type === "Budget" ? "bg-accent" : ev.type === "Complaints" ? "bg-destructive" : "bg-amber-500"
            )} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">{ev.text}</p>
              <p className="text-xs text-muted-foreground">{ev.time}</p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No events</p>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
