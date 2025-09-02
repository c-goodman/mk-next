"use client";

import SkillLineChart from "@/components/ui/charts/SeasonalSkillChart";
import { TSkillTable } from "@/app/lib/definitions";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fetchSkillPerSeasonFourPlayer,
  fetchUniqueSeasonsIds,
} from "@/app/lib/data";

export default function SeasonalSkillChart() {
  const [seasons, setSeasons] = useState<number[] | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [seasonData, setSeasonData] = useState<TSkillTable[] | null>(null);
  const [seasonsLoading, setSeasonsLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load seasons on mount
  useEffect(() => {
    const loadSeasons = async () => {
      setSeasonsLoading(true);
      setError(null);

      try {
        const seasonIds = await fetchUniqueSeasonsIds();
        setSeasons(seasonIds);

        // Auto-select the first season if available
        if (seasonIds && seasonIds.length > 0) {
          setSelectedSeason(seasonIds[0]);
        }
      } catch (err) {
        console.error("Failed to load seasons:", err);
        setError("Failed to load seasons");
      } finally {
        setSeasonsLoading(false);
      }
    };

    loadSeasons();
  }, []);

  // Load season data when selectedSeason changes
  useEffect(() => {
    if (selectedSeason === null) {
      setSeasonData(null);
      return;
    }

    const loadSeasonData = async () => {
      setDataLoading(true);
      setError(null);

      try {
        const data = await fetchSkillPerSeasonFourPlayer(selectedSeason);
        setSeasonData(data || []);
      } catch (err) {
        console.error("Failed to load season data:", err);
        setError(`Failed to load data for Season ${selectedSeason}`);
        setSeasonData(null);
      } finally {
        setDataLoading(false);
      }
    };

    loadSeasonData();
  }, [selectedSeason]);

  const handleSeasonChange = (value: string) => {
    setSelectedSeason(Number(value));
  };

  // Show error state
  if (error) {
    return (
      <div className="w-full mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Skill Chart by Season</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Skill Chart by Season</h1>

      {/* Season Selector */}
      <div className="mb-4">
        {seasonsLoading ? (
          <div className="w-[200px] h-10 bg-gray-200 animate-pulse rounded"></div>
        ) : seasons && seasons.length > 0 ? (
          <Select
            value={selectedSeason?.toString() ?? ""}
            onValueChange={handleSeasonChange}
            disabled={dataLoading}
          >
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="Select Season" />
            </SelectTrigger>
            <SelectContent>
              {seasons.map((season) => (
                <SelectItem key={season} value={season.toString()}>
                  Season {season}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <p className="text-gray-600">No seasons available</p>
        )}
      </div>

      {/* Chart Container */}
      <div className="h-[700px] bg-white p-4 rounded-xl shadow">
        {seasonsLoading || dataLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600">
                {seasonsLoading
                  ? "Loading seasons..."
                  : "Loading chart data..."}
              </p>
            </div>
          </div>
        ) : seasonData === null ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-600">Select a season to view chart</p>
          </div>
        ) : seasonData.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-600">
              No data available for Season {selectedSeason}
            </p>
          </div>
        ) : (
          <SkillLineChart
            data={seasonData}
            downloadFileName="OSRChart.html"
            downloadTitle={`Openskill Rating: Season ${selectedSeason}`}
          />
        )}
      </div>
    </div>
  );
}
