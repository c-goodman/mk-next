import {
  CursorArrowRaysIcon,
  HandRaisedIcon,
  ChevronUpDownIcon,
  DocumentArrowDownIcon,
  ViewfinderCircleIcon,
  EyeIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

interface LineChartSettingsMenuProps {
  onResetZoom: () => void;
  onToggleLasso: () => void;
  onTogglePanning?: () => void;
  onToggleScrollZoom?: () => void;
  onToggleColorBlind?: () => void;
  onToggleRounding?: () => void;
  onDownload?: () => void;
  onToggleDataLabels?: () => void;
  lassoEnabled: boolean;
  panningEnabled?: boolean;
  scrollZoomEnabled?: boolean;
  colorBlindEnabled?: boolean;
  tooltipRoundingEnabled?: boolean;
  dataLabelsEnabled?: boolean;
}

export function LineChartSettingsMenu({
  onResetZoom,
  onToggleLasso,
  onTogglePanning,
  onToggleScrollZoom,
  onToggleColorBlind,
  onToggleRounding,
  onDownload,
  onToggleDataLabels,
  lassoEnabled,
  panningEnabled,
  scrollZoomEnabled,
  colorBlindEnabled,
  tooltipRoundingEnabled,
  dataLabelsEnabled,
}: LineChartSettingsMenuProps) {
  return (
    <div className="absolute top-8 right-0 flex flex-row space-x-1 bg-white p-1 rounded shadow z-10">
      <button onClick={onResetZoom} className="hover:bg-red-100 p-1 rounded">
        <ViewfinderCircleIcon title="Reset Zoom" className="h-5 w-5" />
      </button>
      <button onClick={onToggleLasso} className="hover:bg-red-100 p-1 rounded">
        <CursorArrowRaysIcon
          title={`Lasso Selection ${lassoEnabled ? "Enabled" : "Disabled"}`}
          className={`h-5 w-5 ${!lassoEnabled ? "text-gray-400" : ""}`}
        />
      </button>
      <button
        onClick={onTogglePanning}
        className="hover:bg-red-100 p-1 rounded"
      >
        <HandRaisedIcon
          title={`Panning ${panningEnabled ? "Enabled" : "Disabled"}`}
          className={`h-5 w-5 ${!panningEnabled ? "text-gray-400" : ""}`}
        />
      </button>
      <button
        onClick={onToggleScrollZoom}
        className="hover:bg-red-100 p-1 rounded"
      >
        <ChevronUpDownIcon
          title={`Scroll Zoom ${scrollZoomEnabled ? "Enabled" : "Disabled"}`}
          className={`h-5 w-5 ${!scrollZoomEnabled ? "text-gray-400" : ""}`}
        />
      </button>
      {onToggleDataLabels && (
        <button
          onClick={onToggleRounding}
          className="hover:bg-red-100 p-1 rounded"
        >
          <TagIcon
            title={`Data Labels ${dataLabelsEnabled ? "Enabled" : "Disabled"}`}
            className={`h-5 w-5 ${!dataLabelsEnabled ? "text-gray-400" : ""}`}
          />
        </button>
      )}
      <button
        onClick={onToggleRounding}
        title={`Tooltip Rounding ${
          tooltipRoundingEnabled ? "Enabled" : "Disabled"
        }`}
        className={`hover:bg-red-100 p-1 rounded flex items-center justify-center ${
          !tooltipRoundingEnabled ? "text-gray-400" : ""
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-decimals-arrow-left-icon lucide-decimals-arrow-left"
        >
          <path d="m13 21-3-3 3-3" />
          <path d="M20 18H10" />
          <path d="M3 11h.01" />
          <rect x="6" y="3" width="5" height="8" rx="2.5" />
        </svg>
      </button>
      <button
        onClick={onToggleColorBlind}
        className="hover:bg-red-100 p-1 rounded"
      >
        <EyeIcon
          title={`Color Blind Scale ${
            colorBlindEnabled ? "Enabled" : "Disabled"
          }`}
          className={`h-5 w-5 ${!colorBlindEnabled ? "text-gray-400" : ""}`}
        />
      </button>
      <button onClick={onDownload} className="hover:bg-red-100 p-1 rounded">
        <DocumentArrowDownIcon title="Download HTML" className="h-5 w-5" />
      </button>
    </div>
  );
}
