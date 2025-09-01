"use client";

import Cog8ToothIcon from "@heroicons/react/24/outline/Cog8ToothIcon";
import zoomPlugin from "chartjs-plugin-zoom";
import { downloadDateLineChart } from "../utils/downloadDateLineChart";
import { LineChartSettingsMenu } from "./LineChartSettingsMenu";
import { OPENSKILL_ORDINAL_TO_FIXED } from "@/types/constants";
import { useEffect, useRef, useState } from "react";
import "chartjs-adapter-date-fns";
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
  downloadTitle: string;
  downloadFileName: string;
}

function SkillLineChart({ data, downloadTitle, downloadFileName }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart<"line", { x: number; y: number }[]> | null>(
    null
  );

  const [showSettings, setShowSettings] = useState(false);
  const [panningEnabled, setPanningEnabled] = useState(false);
  const [lassoEnabled, setLassoEnabled] = useState(true);
  const [scrollZoomEnabled, setScrollZoomEnabled] = useState(false);
  const [colorBlindEnabled, setColorBlindEnabled] = useState(false);
  const [tooltipRoundingEnabled, setTooltipRoundingEnabled] = useState(true);

  // Group by player
  const groupByPlayer = (data: TSkillTable[]) => {
    const grouped: Record<string, TSkillTable[]> = {};
    for (const entry of data) {
      if (!grouped[entry.player]) grouped[entry.player] = [];
      grouped[entry.player].push(entry);
    }
    return grouped;
  };

  // Simple uncontrolled button to show or hide controls
  const toggleControls = () => setShowSettings((prev) => !prev);
  const toggleColorBlindEnabled = () => setColorBlindEnabled((prev) => !prev);
  const toggleTooltipRoundingEnabled = () =>
    setTooltipRoundingEnabled((prev) => !prev);

  const handleResetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom(); // Chart.js plugin method
    }
  };

  const handleToggleLasso = () => {
    if (chartRef.current) {
      const chart = chartRef.current;
      const zoomOptions = chart.options.plugins?.zoom?.zoom;
      if (zoomOptions?.drag) {
        zoomOptions.drag.enabled = !zoomOptions.drag.enabled;
        setLassoEnabled(zoomOptions.drag.enabled);
        chart.update();
      }
    }
  };

  const handleTogglePanning = () => {
    if (chartRef.current) {
      const chart = chartRef.current;
      const zoomOptions = chart.options.plugins?.zoom;
      if (zoomOptions?.pan) {
        zoomOptions.pan.enabled = !zoomOptions.pan.enabled;
        setPanningEnabled(zoomOptions.pan.enabled);
        chart.update();
      }
    }
  };

  const handleToggleWheel = () => {
    if (chartRef.current) {
      const chart = chartRef.current;
      const zoomOptions = chart.options.plugins?.zoom?.zoom;
      if (zoomOptions?.wheel) {
        zoomOptions.wheel.enabled = !zoomOptions.wheel.enabled;
        setScrollZoomEnabled(zoomOptions.wheel.enabled);
        chart.update();
      }
    }
  };

  const handleDownloadLineChart = () => {
    downloadDateLineChart(chartRef.current, downloadTitle, downloadFileName);
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
        borderColor: getColor({
          index: index,
          alpha: 1,
          colorBlindEnabled: colorBlindEnabled,
        }),
        backgroundColor: getColor({
          index: index,
          alpha: 0.3,
          colorBlindEnabled: colorBlindEnabled,
        }),
        pointRadius: 3,
        tension: 0.1,
        // datalabels: {
        //   labels: {
        //     value: {
        //       color: getColor({
        //         index: index,
        //         alpha: 1,
        //         colorBlindEnabled: colorBlindEnabled,
        //       }),
        //     },
        //   },
        // },
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
            title: { display: true, text: "Date" },
          },
          y: {
            title: { display: true, text: "Openskill Rating (OSR)" },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const d = tooltipItem.raw as TSkillTable;

                // Optionally round the skill rating
                const ranking = tooltipRoundingEnabled
                  ? d.ordinal.toFixed(OPENSKILL_ORDINAL_TO_FIXED)
                  : d.ordinal;

                return [
                  `Player: ${d.player}`,
                  `OSR: ${ranking}`,
                  `Game ID: ${d.game_id}`,
                  `SUID: ${d.suid}`,
                  `Place: ${d.place}`,
                  `Character: ${d.character}`,
                  `Map: ${d.map}`,
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
  }, [data, colorBlindEnabled, tooltipRoundingEnabled]);

  return (
    <div className="relative w-full h-full">
      {/* Settings Button */}
      <button
        type="button"
        onClick={toggleControls}
        className="absolute top-0 right-0 bg-white hover:bg-red-100 p-1 rounded shadow z-20"
      >
        <Cog8ToothIcon title="Toggle Controls" className="h-5 w-5" />
      </button>

      {/* Settings Menu */}
      {showSettings && (
        <LineChartSettingsMenu
          onResetZoom={handleResetZoom}
          onToggleLasso={handleToggleLasso}
          onTogglePanning={handleTogglePanning}
          onToggleScrollZoom={handleToggleWheel}
          onToggleColorBlind={toggleColorBlindEnabled}
          onDownload={handleDownloadLineChart}
          onToggleRounding={toggleTooltipRoundingEnabled}
          lassoEnabled={lassoEnabled}
          panningEnabled={panningEnabled}
          scrollZoomEnabled={scrollZoomEnabled}
          colorBlindEnabled={colorBlindEnabled}
          tooltipRoundingEnabled={tooltipRoundingEnabled}
        />
      )}

      {/* Chart Canvas */}
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}

export default SkillLineChart;

// 🎨 Helper: getColor(index)

interface GetColorProps {
  index: number;
  alpha: number;
  colorBlindEnabled: boolean;
}

function getColor({
  index,
  alpha = 1,
  colorBlindEnabled,
}: GetColorProps): string {
  if (colorBlindEnabled) {
    // <https://davidmathlogic.com/colorblind/#%23332288-%23117733-%2344AA99-%2388CCEE-%23DDCC77-%23CC6677-%23AA4499-%23882255>
    const colors = [
      `rgba(51, 34, 136, ${alpha})`,
      `rgba(17, 119, 51, ${alpha})`,
      `rgba(68, 170, 153, ${alpha})`,
      `rgba(136, 204, 238, ${alpha})`,
      `rgba(221, 204, 119, ${alpha})`,
      `rgba(204, 102, 119, ${alpha})`,
      `rgba(170, 68, 153, ${alpha})`,
      `rgba(136, 34, 85, ${alpha})`,
    ];
    return colors[index % colors.length];
  }
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
