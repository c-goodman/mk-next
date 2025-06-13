"use client";

import { CalendarIcon } from "@heroicons/react/24/outline";
import { lusitana } from "@/components/ui/fonts";
import { useEffect, useState } from "react";
import {
  fetchPlayers,
  fetchRecentGamesMetricsAllPlayers,
  fetchRecentGamesMetricsPerPlayer,
} from "@/app/lib/data";
import { TPlayerNames, TRecentGamesMetricsChart } from "@/app/lib/definitions";
import RecentGamesBarChart from "../charts/RecentGamesChart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";

// This component is representational only.
// For data visualization UI, check out:
// https://www.tremor.so/
// https://www.chartjs.org/
// https://airbnb.io/visx/

export default function RecentGamesChart() {
  // Make component async, remove the props

  const [recentGamesMetrics, setRecentGamesMetrics] = useState<
    TRecentGamesMetricsChart[]
  >([]);
  const [metric, setMetric] =
    useState<keyof Omit<TRecentGamesMetricsChart, "month">>(
      "avg_games_per_day"
    );

  const [allPlayerNames, setAllPlayerNames] = useState<TPlayerNames[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<string>("All");

  const metricOptions =
    recentGamesMetrics && recentGamesMetrics.length > 0
      ? (Object.keys(recentGamesMetrics[0]).filter(
          (key) => key !== "month"
        ) as (keyof Omit<TRecentGamesMetricsChart, "month">)[])
      : [];

  // Fetch possible usernames
  useEffect(() => {
    const fetchAllPlayerNames = async () => {
      const allPlayerNamesInitial = await fetchPlayers(); // Fetch data inside the component

      setAllPlayerNames(allPlayerNamesInitial);
    };

    fetchAllPlayerNames();
  }, []);

  // Fetch Metrics for a Single Player
  useEffect(() => {
    if (selectedPlayer === "All") {
      const fetchData = async () => {
        const recentGamesAllPlayersInitial =
          await fetchRecentGamesMetricsAllPlayers();
        setRecentGamesMetrics(recentGamesAllPlayersInitial);
      };

      fetchData();
    } else {
      const fetchDataPerPlayer = async () => {
        const recentGamesSelectedPlayerInitial =
          await fetchRecentGamesMetricsPerPlayer(selectedPlayer); // Fetch data inside the component
        setRecentGamesMetrics(recentGamesSelectedPlayerInitial);
      };

      fetchDataPerPlayer();
    }
  }, [selectedPlayer]);

  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Recent Games
      </h2>
      {allPlayerNames && (
        <div className="p-1 mb-2">
          <Select
            defaultValue={"All"}
            onValueChange={(value) => setSelectedPlayer(value)}
          >
            <SelectTrigger className="w-[200px] h-[45px] justify-between bg-white">
              <SelectValue placeholder="Select Player..." />
            </SelectTrigger>
            <SelectContent className="relative flex items-center w-[200px] justify-between">
              {allPlayerNames.map((item) => (
                <SelectItem
                  key={item.player_name}
                  value={item.player_name}
                  className="relative flex items-center w-[200px] justify-between"
                >
                  {item.player_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {recentGamesMetrics && metricOptions && (
        <div className="p-1 mb-2">
          <Select
            defaultValue={metric}
            onValueChange={(value) =>
              setMetric(value as keyof Omit<TRecentGamesMetricsChart, "month">)
            }
          >
            <SelectTrigger className="w-[200px] h-[45px] justify-between bg-white">
              <SelectValue placeholder="Select Player..." />
            </SelectTrigger>
            <SelectContent className="relative flex items-center w-[200px] justify-between">
              {metricOptions.map((item) => (
                <SelectItem
                  key={item}
                  value={item}
                  className="relative flex items-center w-[200px] justify-between"
                >
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="rounded-xl bg-gray-50 p-4">
        <div className="sm:grid-cols-13 mt-0 grid grid-cols-12 h-[300px] md:h-[500px] items-end gap-2 rounded-md bg-white p-4 md:gap-4">
          <RecentGamesBarChart games={recentGamesMetrics} metric={metric} />
        </div>
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Last 12 months</h3>
        </div>
      </div>
    </div>
  );
}
