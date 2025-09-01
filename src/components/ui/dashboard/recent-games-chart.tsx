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

export default function RecentGamesChart() {
  type TSelectMetrics = Omit<
    TRecentGamesMetricsChart,
    "month" | "most_recent_day"
  >;
  type TSelectMetricsItem = {
    value: keyof TSelectMetrics;
    label: string;
  };

  const [recentGamesMetrics, setRecentGamesMetrics] = useState<
    TRecentGamesMetricsChart[]
  >([]);

  const [metric, setMetric] =
    useState<keyof TSelectMetrics>("avg_games_per_day");
  const [metricLabel, setMetricLabel] = useState<string>("Games per Day");

  const [allPlayerNames, setAllPlayerNames] = useState<TPlayerNames[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<string>("All");

  const metricLabels: Record<keyof TSelectMetrics, string> = {
    total_games_played: "Total Games",
    avg_games_per_day: "Games per Day",
    avg_games_per_day_with_data: "Games per Day (With Data)",
    days_with_data: "Days with Data",
    days_with_data_percentage: "Days Played per Month",
    total_games_2_players: "Total Games (2P)",
    total_games_3_players: "Total Games (3P)",
    total_games_4_players: "Total Games (4P)",
    avg_games_per_day_2_players: "Games per Day (2P)",
    avg_games_per_day_3_players: "Games per Day (3P)",
    avg_games_per_day_4_players: "Games per Day (4P)",
    avg_games_per_day_with_data_2_players: "Games per Day (2P, With Data)",
    avg_games_per_day_with_data_3_players: "Games per Day (3P, With Data)",
    avg_games_per_day_with_data_4_players: "Games per Day (4P, With Data)",
  };

  // function humanizeKey(key: string): string {
  //   return key
  //     .replace(/_/g, " ") // Replace underscores with spaces
  //     .replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize each word
  // }

  const metricOptions: TSelectMetricsItem[] =
    recentGamesMetrics && recentGamesMetrics.length > 0
      ? (Object.keys(metricLabels) as (keyof TRecentGamesMetricsChart)[])
          .filter((key) => key !== "month" && key !== "most_recent_day")
          .map((key) => ({
            value: key,
            // No fallback, all keys are defined in record map
            label: metricLabels[key],
            // // Fallback to humanize key if no custom label
            // label: metricLabels[key] ?? humanizeKey(key),
          }))
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
            onValueChange={(value) => {
              const metricKey = value as keyof TSelectMetrics;
              setMetric(metricKey);

              // Find and set the human-readable label
              // No fallback, strict definition
              const selectedLabel = metricLabels[metricKey];
              setMetricLabel(selectedLabel);
              // const selectedLabel =
              //   metricLabels[metricKey] ?? humanizeKey(metricKey);
              // setMetricLabel(selectedLabel);
            }}
          >
            <SelectTrigger className="w-[250px] h-[45px] justify-between bg-white">
              <SelectValue placeholder="Select Player..." />
            </SelectTrigger>
            <SelectContent className="relative flex items-center w-[250px] justify-between">
              {metricOptions.map((item) => (
                <SelectItem
                  key={item.value}
                  value={item.value}
                  className="relative flex items-center w-[250px] justify-between"
                >
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="rounded-xl bg-gray-50 p-4">
        <div className="sm:grid-cols-13 mt-0 grid grid-cols-12 h-[300px] md:h-[500px] items-end gap-2 rounded-md bg-white p-4 md:gap-4">
          <RecentGamesBarChart
            games={recentGamesMetrics}
            metric={metric}
            metricLabel={metricLabel}
          />
        </div>
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Last 12 months</h3>
        </div>
      </div>
    </div>
  );
}
