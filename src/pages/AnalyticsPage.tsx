import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const AnalyticsPage: React.FC = () => {
  const { data } = useApp();
  const [range, setRange] = useState<"30" | "90" | "365">("30");

  // Mock time series for image scores
  const repsToChart = data.representatives.slice(0, 3);
  const generateSeries = (baseScore: number) =>
    Array.from({ length: parseInt(range) }, (_, i) => ({
      day: i + 1,
      score: Math.max(0, Math.min(100, baseScore + Math.sin(i / 5) * 8 + (Math.random() - 0.5) * 6)),
    }));

  // Complaints by category
  const categoryCounts: Record<string, number> = {};
  data.complaints.forEach(c => {
    const cat = c.status;
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });
  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));

  // Budget utilization
  const budgetData = data.representatives.map(r => ({
    name: r.name.split(" ")[0],
    allocated: r.budgetAllocated / 100000,
    used: r.budgetUsed / 100000,
  }));

  const COLORS = ["hsl(155,67%,37%)", "hsl(224,83%,54%)", "hsl(0,62%,54%)", "hsl(45,93%,47%)", "hsl(207,75%,21%)"];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Analytics</h1>
        <div className="flex gap-1 bg-secondary rounded-lg p-0.5">
          {(["30", "90", "365"] as const).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${range === r ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {r}d
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Score Trends */}
        <div className="card-gov space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Public Image Score Trends</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(220,9%,46%)" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="hsl(220,9%,46%)" />
              <Tooltip />
              {repsToChart.map((rep, i) => (
                <Line
                  key={rep.id}
                  data={generateSeries(rep.imageScore)}
                  dataKey="score"
                  name={rep.name}
                  stroke={COLORS[i]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Complaints by Status */}
        <div className="card-gov space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Complaints by Status</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Budget Utilization */}
        <div className="card-gov space-y-3 lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground">Budget Utilization (₹ Lakhs)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={budgetData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(220,9%,46%)" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(220,9%,46%)" />
              <Tooltip />
              <Bar dataKey="allocated" fill="hsl(207,75%,21%)" radius={[4, 4, 0, 0]} name="Allocated" />
              <Bar dataKey="used" fill="hsl(155,67%,37%)" radius={[4, 4, 0, 0]} name="Used" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Narratives */}
        <div className="card-gov space-y-3 lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground">Top Flagged Narratives</h3>
          <div className="space-y-2">
            {data.socialNarratives.filter(n => n.sentiment === "negative").slice(0, 5).map(n => (
              <div key={n.id} className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium">{n.platform}</span>
                <p className="text-sm text-foreground flex-1">"{n.excerpt}"</p>
                <span className="text-xs text-muted-foreground">{n.constituency}</span>
                <span className="text-xs text-muted-foreground">{n.occurrences} mentions</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsPage;
