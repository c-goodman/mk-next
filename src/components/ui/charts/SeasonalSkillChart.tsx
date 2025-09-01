"use client";

import { useEffect, useRef, useState } from "react";
import {
  Chart,
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Title,
  LineController,
  Legend,
  ChartOptions,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import "chartjs-adapter-date-fns";
import type { TSkillTable } from "@/app/lib/definitions";

Chart.register(
  LineElement,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
  Title,
  LineController,
  Legend,
  zoomPlugin
);

interface Props {
  data: TSkillTable[];
}

function SkillLineChart({ data }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart<"line", { x: number; y: number }[]> | null>(
    null
  );

  const [showSettings, setShowSettings] = useState(false);
  const [lassoEnabled, setLassoEnabled] = useState(true);

  // --- Helper: Group by player
  const groupByPlayer = (data: TSkillTable[]) => {
    const grouped: Record<string, TSkillTable[]> = {};
    for (const entry of data) {
      if (!grouped[entry.player]) grouped[entry.player] = [];
      grouped[entry.player].push(entry);
    }
    return grouped;
  };

  // --- Helper: Reset Zoom
  const handleResetZoom = () => {
    chartRef.current?.resetZoom();
  };

  // --- Helper: Toggle Lasso
  const toggleLasso = () => {
    setLassoEnabled((prev) => !prev);
  };

  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy();
    if (!data || data.length === 0 || !canvasRef.current) return;

    const grouped = groupByPlayer(data);
    const datasets = Object.entries(grouped).map(([player, entries], index) => {
      const sorted = entries.sort(
        (a, b) => +new Date(a.timestamp) - +new Date(b.timestamp)
      );
      return {
        label: player,
        data: sorted.map((d) => ({
          x: new Date(d.timestamp).getTime(),
          y: d.ordinal,
          ...d,
        })),
        borderColor: getColor(index),
        backgroundColor: getColor(index, 0.3),
        pointRadius: 3,
        tension: 0.1,
      };
    });

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: "line",
      data: { datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        parsing: false,
        scales: {
          x: {
            type: "time",
            time: { unit: "day" },
            title: { display: true, text: "Timestamp" },
          },
          y: {
            title: { display: true, text: "Ordinal" },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const d = tooltipItem.raw as TSkillTable;
                return [
                  `Player: ${d.player}`,
                  `Game ID: ${d.game_id}`,
                  `SUID: ${d.suid}`,
                  `Place: ${d.place}`,
                  `Character: ${d.character}`,
                  `Map: ${d.map}`,
                  `Ordinal: ${d.ordinal}`,
                ];
              },
            },
          },
          legend: { position: "top" },
          zoom: {
            zoom: {
              drag: {
                enabled: lassoEnabled,
                backgroundColor: "rgba(0,0,0,0.1)",
                borderColor: "rgba(0,0,0,0.3)",
                borderWidth: 1,
              },
              mode: "xy",
            },
            pan: {
              enabled: false,
              mode: "xy",
            },
          },
        },
      } as ChartOptions<"line">,
    });

    chartRef.current = chart;

    return () => chart.destroy();
  }, [data, lassoEnabled]);

  return (
    <div className="relative w-full h-full">
      {/* Settings Button */}
      <button
        className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow hover:bg-gray-100"
        onClick={() => setShowSettings((s) => !s)}
        aria-label="Settings"
      >
        ⚙️
      </button>

      {/* Settings Menu */}
      {showSettings && (
        <div className="absolute top-12 right-2 z-20 w-64 bg-white border rounded shadow p-4 space-y-4">
          <div>
            <label className="flex items-center justify-between">
              <span>🔄 Reset Zoom</span>
              <button
                className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                onClick={handleResetZoom}
              >
                Reset
              </button>
            </label>
          </div>
          <div>
            <label className="flex items-center justify-between">
              <span>🔍 Lasso Zoom</span>
              <input
                type="checkbox"
                checked={lassoEnabled}
                onChange={toggleLasso}
                className="w-4 h-4"
              />
            </label>
          </div>
        </div>
      )}

      {/* Chart Canvas */}
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}

export default SkillLineChart;

// 🎨 Helper: getColor(index)
function getColor(index: number, alpha = 1): string {
  const colors = [
    `rgba(255, 99, 132, ${alpha})`,
    `rgba(54, 162, 235, ${alpha})`,
    `rgba(255, 206, 86, ${alpha})`,
    `rgba(75, 192, 192, ${alpha})`,
    `rgba(153, 102, 255, ${alpha})`,
    `rgba(255, 159, 64, ${alpha})`,
  ];
  return colors[index % colors.length];
}
