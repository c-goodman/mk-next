import CardWrapper from "@/components/ui/dashboard/cards";
import LatestGames from "@/components/ui/dashboard/latest-games";
import RecentGamesChart from "@/components/ui/dashboard/recent-games-chart";
import { lusitana } from "@/components/ui/fonts";
import { Suspense } from "react";
import {
  RecentGamesChartSkeleton,
  LatestGamesSkeleton,
  CardsSkeleton,
} from "@/components/ui/skeletons";

export default async function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 xl:grid-cols-8">
        <Suspense fallback={<RecentGamesChartSkeleton />}>
          <RecentGamesChart />
        </Suspense>
        <Suspense fallback={<LatestGamesSkeleton />}>
          <LatestGames />
        </Suspense>
      </div>
    </main>
  );
}
