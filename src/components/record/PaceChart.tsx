"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { paceToMinutes } from "@/lib/utils";
import type { Split } from "@/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
);

interface PaceChartProps {
  splits: Split[];
}

export default function PaceChart({ splits }: PaceChartProps) {
  const labels = splits.map((s) => s.point);
  const paceData = splits.map((s) => paceToMinutes(s.pace));

  const data = {
    labels,
    datasets: [
      {
        label: "Pace (min/km)",
        data: paceData,
        borderColor: "#4FC3F7",
        backgroundColor: "rgba(79,195,247,0.1)",
        borderWidth: 3,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#4FC3F7",
        pointBorderWidth: 2,
        pointRadius: 5,
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { color: "rgba(255,255,255,0.05)" },
        ticks: { color: "#888", font: { size: 11 } },
      },
      y: {
        grid: { color: "rgba(255,255,255,0.05)" },
        ticks: {
          color: "#888",
          font: { size: 11 },
          callback: (value: number | string) => {
            if (typeof value === "number") {
              return value.toFixed(0);
            }
            return value;
          },
        },
        suggestedMin: Math.min(...paceData) - 1,
        suggestedMax: Math.max(...paceData) + 1,
      },
    },
  };

  return (
    <div className="w-full h-[200px]">
      <Line data={data} options={options} />
    </div>
  );
}
