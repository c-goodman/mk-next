"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SkillLineChart from "@/components/ui/charts/SeasonalSkillChart";
import {
  useFetchSkillSeasonFourPlayer,
  useFetchUniqueSeasonsIds,
} from "@/app/lib/hooks/fetch-hooks-client";

export default function SeasonalSkillChart() {
  const seasons = useFetchUniqueSeasonsIds(); // number[] | undefined
  const [selectedSeason, setSelectedSeason] = useState<number | undefined>(
    undefined
  );

  // When selectedSeason changes, fetch the season data
  // If no season selected, pass undefined to hook to avoid fetching
  const seasonData = useFetchSkillSeasonFourPlayer(selectedSeason ?? 0);

  // On initial load, set selectedSeason to first season when seasons are fetched
  if (selectedSeason === undefined && seasons && seasons.length > 0) {
    setSelectedSeason(seasons[0]);
  }

  return (
    <div className="w-full mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Skill Chart by Season</h1>
      {seasons ? (
        <div className="mb-4">
          <Select
            value={selectedSeason?.toString() ?? ""}
            onValueChange={(value) => setSelectedSeason(Number(value))}
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
        </div>
      ) : (
        <p>Loading seasons...</p>
      )}

      <div className="h-[700px] bg-white p-4 rounded-xl shadow">
        {!seasonData ? (
          <p className="text-gray-800">Loading chart...</p>
        ) : seasonData.length > 0 ? (
          <SkillLineChart
            data={seasonData}
            downloadFileName="OSRChart.html"
            downloadTitle={`Openskill Rating: Season ${selectedSeason}`}
          />
        ) : (
          <p className="text-gray-800">
            No data available for Season {selectedSeason}
          </p>
        )}
      </div>
    </div>
  );
}
