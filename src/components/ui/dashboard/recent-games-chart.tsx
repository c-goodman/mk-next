"use client";

import { CalendarIcon } from "@heroicons/react/24/outline";
import { lusitana } from "@/components/ui/fonts";
import { useEffect, useState } from "react";
import { fetchRecentGamesAllPlayers } from "@/app/lib/data";
import { TRecentGamesChart } from "@/app/lib/definitions";
import RecentGamesBarChart from "../charts/RecentGamesChart";

// This component is representational only.
// For data visualization UI, check out:
// https://www.tremor.so/
// https://www.chartjs.org/
// https://airbnb.io/visx/

export default function RecentGamesChart() {
  // Make component async, remove the props

  const [recentGamesAllPlayers, setRecentGamesAllPlayers] = useState<
    TRecentGamesChart[]
  >([]);

  useEffect(() => {
    // Example of client-side fetching
    const fetchData = async () => {
      const recentGamesAllPlayersInitial = await fetchRecentGamesAllPlayers(); // Fetch data inside the component
      setRecentGamesAllPlayers(recentGamesAllPlayersInitial);
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Recent Games
      </h2>

      <div className="rounded-xl bg-gray-50 p-4">
        <div className="sm:grid-cols-13 mt-0 grid grid-cols-12 h-[300px] md:h-[500px] items-end gap-2 rounded-md bg-white p-4 md:gap-4">
          <RecentGamesBarChart games={recentGamesAllPlayers} />
        </div>
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Last 12 months</h3>
        </div>
      </div>
    </div>
  );
}
