import { ChartJSOrUndefined } from "../charts/LineChart";

export const downloadDateLineChart = (
  chartRef: ChartJSOrUndefined<"line"> | null,
  title: string,
  fileName: string
) => {
  if (!chartRef) return;

  const chart = chartRef;

  // Create a deep copy of the data to avoid circular references
  // Only copy the essential properties needed to recreate the chart
  const safeData = {
    labels: [...(chart.data.labels || [])],
    datasets: chart.data.datasets.map((dataset) => ({
      label: dataset.label,
      data: [...dataset.data],
      datalabels: dataset.datalabels || {},
      backgroundColor: dataset.backgroundColor,
      borderColor: dataset.borderColor,
      borderWidth: dataset.borderWidth,
      pointBackgroundColor: dataset.pointBackgroundColor,
      pointBorderColor: dataset.pointBorderColor,
      pointHoverBackgroundColor: dataset.pointHoverBackgroundColor,
      pointHoverBorderColor: dataset.pointHoverBorderColor,
      tension: dataset.tension,
      fill: dataset.fill,
    })),
  };

  // Simplify options to avoid circular references
  const safeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time", // Important for date-fns
        time: {
          unit: "day",
        },
        title: chart.options?.scales?.x?.title
          ? {
              display: chart.options.scales.x.title.display,
              text: chart.options.scales.x.title.text,
            }
          : undefined,
        grid: chart.options?.scales?.x?.grid
          ? {
              display: chart.options.scales.x.grid.display,
            }
          : undefined,
      },
      y: {
        title: chart.options?.scales?.y?.title
          ? {
              display: chart.options.scales.y.title.display,
              text: chart.options.scales.y.title.text,
            }
          : undefined,
        grid: chart.options?.scales?.y?.grid
          ? {
              display: chart.options.scales.y.grid.display,
            }
          : undefined,
      },
    },
    plugins: {
      legend: {
        display: chart.options?.plugins?.legend?.display || true,
        position: (chart.options?.plugins?.legend?.position as string) || "top",
      },
      tooltip: {
        enabled: chart.options?.plugins?.tooltip?.enabled !== false,
      },
      zoom: {
        zoom: {
          pinch: { enabled: true },
          drag: { enabled: true },
          mode: "xy",
        },
        limits: {
          x: {
            min: chart.options?.plugins?.zoom?.limits?.x?.min || "original",
            max: chart.options?.plugins?.zoom?.limits?.x?.max || "original",
          },
          y: {
            min: chart.options?.plugins?.zoom?.limits?.y?.min || "original",
            max: chart.options?.plugins?.zoom?.limits?.y?.max || "original",
          },
        },
      },
      datalabels: {
        display: true, // will be controlled by button
        align: "bottom" as const,
        color: "black" as const, // Override in handleGraphData functions
        font: { weight: "bold" as const },
        formatter: (value: number) => value,
      },
    },
  };

  const chartConfig = {
    type: "line",
    data: safeData,
    options: safeOptions,
  };

  // Enhanced HTML template with plugins and better styling
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Interactive Chart</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-zoom"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns"></script>
<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  .chart-container {
    position: relative;
    height: 600px;
    width: 100%;
    margin-bottom: 20px;
  }
  h1 {
    color: #333;
    font-size: 24px;
    margin-bottom: 20px;
  }
  .controls {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }
  button {
    background-color: #f8f9fa;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 8px 16px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  button:hover {
    background-color: #e9ecef;
  }
  button svg {
    width: 16px;
    height: 16px;
  }
</style>
</head>
<body>
<h1>${title}</h1>

<div class="controls">
  <button id="resetZoom">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
    Reset Zoom
  </button>
  
  <button id="toggleDrag">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5" />
    </svg>
    Toggle Drag Zoom
  </button>
</div>

<div class="chart-container">
  <canvas id="myChart"></canvas>
</div>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    if (window.ChartDataLabels) {
      Chart.register(ChartDataLabels);
    }
    
    // config
    const ctx = document.getElementById('myChart').getContext('2d');
    const config = ${JSON.stringify(chartConfig, null, 2)};
    
    const chart = new Chart(ctx, config);
    
    // reset zoom
    document.getElementById('resetZoom').addEventListener('click', function() {
      chart.resetZoom();
    });
    
    // lasso zoom toggle
    let dragEnabled = true;
    document.getElementById('toggleDrag').addEventListener('click', function() {
      dragEnabled = !dragEnabled;
      chart.options.plugins.zoom.zoom.drag.enabled = dragEnabled;
      this.style.backgroundColor = dragEnabled ? '#e2e8f0' : '';
      chart.update();
    });
    
    // initial state
    if (dragEnabled) {
      document.getElementById('toggleDrag').style.backgroundColor = '#e2e8f0';
    }
  });
</script>
</body>
</html>
`;

  // Create blob and download
  const blob = new Blob([htmlContent], { type: "text/html" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};
