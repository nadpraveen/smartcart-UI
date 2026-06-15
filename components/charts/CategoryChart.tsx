"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const COLORS = [
  "#6366F1",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#A855F7",
];

export default function CategoryChart({ data }: any) {
  const total = data.reduce((sum: number, d: any) => sum + d.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white p-4 rounded-2xl shadow-sm space-y-4"
    >
      {/* HEADER */}
      <div>
        <h3 className="text-sm font-medium">
          Category Distribution
        </h3>
        <p className="text-xs text-gray-400">
          How your budget is allocated
        </p>
      </div>

      {/* CHART WITH CENTER LABEL */}
      <div className="relative w-full h-52 flex items-center justify-center">

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="category"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              isAnimationActive={true}
              animationDuration={600}
              animationEasing="ease-out"
            >
              {data.map((_: any, i: number) => (
                <Cell
                  key={i}
                  fill={COLORS[i % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value: number) => `₹${value}`}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* 🔥 CENTER LABEL */}
        <div className="absolute flex flex-col items-center justify-center">
          <p className="text-xs text-gray-400">Total</p>
          <p className="text-lg font-semibold">₹{total}</p>
        </div>

      </div>

      {/* LEGEND */}
      <div className="space-y-2">
        {data.map((item: any, i: number) => {
          const percent = ((item.value / total) * 100).toFixed(0);

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex justify-between items-center text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      COLORS[i % COLORS.length],
                  }}
                />
                <span className="capitalize">
                  {item.category}
                </span>
              </div>

              <div className="text-gray-500">
                ₹{item.value} ({percent}%)
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}