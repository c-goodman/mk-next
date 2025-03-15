import { TRecentGamesChart } from "@/app/lib/definitions";
import { useEffect, useRef } from "react";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  ChartTypeRegistry,
  TooltipItem,
  Tooltip,
} from "chart.js";

// Registering necessary chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip
);
Chart.defaults.color = "#2196F3";

interface RecentGamesData {
  games: TRecentGamesChart[];
}

function RecentGamesBarChart({ games: games }: RecentGamesData) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null); // Ref to store the chart instance

  useEffect(() => {
    // Cleanup the previous chart instance if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Only initialize the chart when there's valid data
    if (!games || games.length === 0 || !canvasRef.current) {
      return;
    }

    const labels = games.map((i) => i.month);
    const gamesCount = games.map((i) => i.total_games_played);

    const data = {
      labels: labels,
      datasets: [
        {
          label: "Recent Games",
          data: gamesCount,
          borderWidth: 1,
          backgroundColor: "rgba(255, 99, 135, 0.8)", // Light red color for the bars
          borderColor: "rgba(255, 99, 132, 1)", // Darker red for the borders
        },
      ],
    };

    const config = {
      type: "bar" as keyof ChartTypeRegistry, // "bar" is now supported since we've registered the necessary components
      data: data,
      options: {
        // Ensure chart resizes with parent element
        responsive: true,
        // Ensure chart resizes with parent element
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              // Customizing the tooltip to show the total revenue
              label: (tooltipItem: TooltipItem<"bar">) => {
                const gamesAmount = tooltipItem.raw as number; // This is the total revenue for the specific bar
                return `Total Games: ${gamesAmount.toString()}`; // Format the value as needed
              },
            },
          },
        },
      },
    };

    const ctx = canvasRef.current.getContext("2d");
    if (ctx) {
      const chartInstance = new Chart(ctx, config);
      chartInstanceRef.current = chartInstance; // Store the chart instance in the ref

      // Cleanup the chart instance when the component unmounts or `revenue` changes
      return () => {
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }
      };
    }
  }, [games]); // Run effect when `revenue` changes

  // Return JSX - Show "No data available" if no revenue data
  if (!games || games.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }

  return <canvas ref={canvasRef} width="100%" height="100%"></canvas>;
}

export default RecentGamesBarChart;
