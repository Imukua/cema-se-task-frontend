"use client";

import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

// Register Chart.js components
Chart.register(...registerables);

interface ProgramStatsChartProps {
  stats: {
    total: number;
    active: number;
    completed: number;
    dropped: number;
  };
}

export function ProgramStatsChart({ stats }: ProgramStatsChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Active", "Completed", "Dropped"],
        datasets: [
          {
            label: "Number of Enrollments",
            data: [stats.active, stats.completed, stats.dropped],
            backgroundColor: [
              "rgba(16, 185, 129, 0.7)", // Green for active
              "rgba(59, 130, 246, 0.7)", // Blue for completed
              "rgba(245, 158, 11, 0.7)", // Amber for dropped
            ],
            borderColor: [
              "rgba(16, 185, 129, 1)",
              "rgba(59, 130, 246, 1)",
              "rgba(245, 158, 11, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0, // Only show whole numbers
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                const total = stats.total;
                const percentage =
                  total > 0 ? Math.round((value / total) * 100) : 0;
                return `${value} enrollments (${percentage}%)`;
              },
            },
          },
        },
      },
    });

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [stats]);

  return <canvas ref={chartRef} />;
}
