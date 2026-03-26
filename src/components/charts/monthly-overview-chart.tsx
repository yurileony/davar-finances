"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

type Point = {
  day: string;
  income: number;
  expense: number;
};

export function MonthlyOverviewChart({ points }: { points: Point[] }) {
  const data = {
    labels: points.map((p) => p.day),
    datasets: [
      {
        label: "Income",
        data: points.map((p) => p.income),
        borderColor: "#00C9A7",
        backgroundColor: "rgba(0, 201, 167, 0.2)"
      },
      {
        label: "Expenses",
        data: points.map((p) => p.expense),
        borderColor: "#EF4444",
        backgroundColor: "rgba(239, 68, 68, 0.2)"
      }
    ]
  };

  return (
    <Line
      data={data}
      options={{
        responsive: true,
        plugins: {
          legend: { position: "top" }
        }
      }}
    />
  );
}
