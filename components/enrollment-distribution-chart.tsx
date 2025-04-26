"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

// Register Chart.js components
Chart.register(...registerables)

interface EnrollmentDistributionChartProps {
  data: {
    active: number
    completed: number
    dropped: number
  }
}

export function EnrollmentDistributionChart({ data }: EnrollmentDistributionChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Active", "Completed", "Dropped"],
        datasets: [
          {
            data: [data.active, data.completed, data.dropped],
            backgroundColor: [
              "rgba(16, 185, 129, 0.7)", // Green for active
              "rgba(59, 130, 246, 0.7)", // Blue for completed
              "rgba(245, 158, 11, 0.7)", // Amber for dropped
            ],
            borderColor: ["rgba(16, 185, 129, 1)", "rgba(59, 130, 246, 1)", "rgba(245, 158, 11, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "65%",
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number
                const total = data.active + data.completed + data.dropped
                const percentage = total > 0 ? Math.round((value / total) * 100) : 0
                return `${context.label}: ${value} (${percentage}%)`
              },
            },
          },
        },
      },
    })

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  return <canvas ref={chartRef} />
}
