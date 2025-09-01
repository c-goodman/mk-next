import ChartDataLabels from "chartjs-plugin-datalabels";
import Cog8ToothIcon from "@heroicons/react/24/outline/Cog8ToothIcon";
import zoomPlugin from "chartjs-plugin-zoom";
import { downloadDateLineChart } from "../utils/downloadDateLineChart";
import { Line } from "react-chartjs-2";
import { LineChartSettingsMenu } from "./LineChartSettingsMenu";
import { useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import type { ChartData, ChartOptions, ChartType } from "chart.js";

export type ChartJSOrUndefined<T extends ChartType> = ChartJS<T> | undefined;

export interface TLineProps {
  options?: ChartOptions<"line">;
  data?: ChartData<"line">;
  downloadTitle: string;
  downloadFileName: string;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin,
  ChartDataLabels
);

export const LineGraph = (props: TLineProps) => {
  const ref = useRef<ChartJSOrUndefined<"line"> | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [showSettings, setShowSettings] = useState(false);
  const [showDataLabels, setShowDataLabels] = useState(true);
  const [panningEnabled, setPanningEnabled] = useState(false);
  const [lassoEnabled, setLassoEnabled] = useState(true);
  const [scrollZoomEnabled, setScrollZoomEnabled] = useState(false);
  //   const [colorBlindEnabled, setColorBlindEnabled] = useState(false);
  //   const [tooltipRoundingEnabled, setTooltipRoundingEnabled] = useState(true);

  // ResizeObserver effect
  useEffect(() => {
    if (!containerRef.current || !ref.current) return;

    const observer = new ResizeObserver(() => {
      ref.current?.resize();
    });

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Simple uncontrolled button to show or hide controls
  const toggleControls = () => setShowSettings((prev) => !prev);

  const handleResetZoom = () => {
    if (ref.current) {
      ref.current.resetZoom(); // Chart.js plugin method
    }
  };

  const handleToggleDataLabels = () => {
    if (ref.current) {
      const chart = ref.current;
      const dataLabelOptions = chart.options.plugins?.datalabels;
      if (dataLabelOptions) {
        // Toggle 'display' property
        const current =
          typeof dataLabelOptions.display === "function"
            ? showDataLabels // fallback to current state if it's a function
            : dataLabelOptions.display;

        const newState = !current;
        dataLabelOptions.display = newState;
        setShowDataLabels(newState);
        chart.update();
      }
    }
  };

  const handleToggleLasso = () => {
    if (ref.current) {
      const chart = ref.current;
      const zoomOptions = chart.options.plugins?.zoom?.zoom;
      if (zoomOptions?.drag) {
        zoomOptions.drag.enabled = !zoomOptions.drag.enabled;
        setLassoEnabled(zoomOptions.drag.enabled);
        chart.update();
      }
    }
  };

  const handleTogglePanning = () => {
    if (ref.current) {
      const chart = ref.current;
      const zoomOptions = chart.options.plugins?.zoom;
      if (zoomOptions?.pan) {
        zoomOptions.pan.enabled = !zoomOptions.pan.enabled;
        setPanningEnabled(zoomOptions.pan.enabled);
        chart.update();
      }
    }
  };

  const handleToggleWheel = () => {
    if (ref.current) {
      const chart = ref.current;
      const zoomOptions = chart.options.plugins?.zoom?.zoom;
      if (zoomOptions?.wheel) {
        zoomOptions.wheel.enabled = !zoomOptions.wheel.enabled;
        setScrollZoomEnabled(zoomOptions.wheel.enabled);
        chart.update();
      }
    }
  };

  const handleDownloadLineChart = () => {
    downloadDateLineChart(
      ref.current,
      props.downloadTitle,
      props.downloadFileName
    );
  };

  // Check if any dataset has at least one data point
  const hasData = props.data?.datasets.some(
    (ds) => Array.isArray(ds.data) && ds.data.length > 0
  );

  if (props.data && hasData) {
    return (
      <div
        ref={containerRef}
        className="chart-container relative w-full h-[400px] overflow-hidden"
        data-testid="line-chart"
      >
        <Line ref={ref} data={props.data} options={props.options} />
        <button
          type="button"
          onClick={toggleControls}
          className="absolute top-0 right-0 bg-white hover:bg-red-100 p-1 rounded shadow z-20"
        >
          <Cog8ToothIcon title="Toggle Controls" className="h-5 w-5" />
        </button>
        {showSettings && (
          <LineChartSettingsMenu
            onResetZoom={handleResetZoom}
            onToggleLasso={handleToggleLasso}
            onTogglePanning={handleTogglePanning}
            onToggleScrollZoom={handleToggleWheel}
            onToggleDataLabels={handleToggleDataLabels}
            onDownload={handleDownloadLineChart}
            lassoEnabled={lassoEnabled}
            panningEnabled={panningEnabled}
            scrollZoomEnabled={scrollZoomEnabled}
            dataLabelsEnabled={showDataLabels}
          />
        )}
      </div>
    );
  }
};
