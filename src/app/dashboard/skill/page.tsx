"use client";

import dynamic from "next/dynamic";

// Dynamically import the component with no SSR
const SeasonalSkillChart = dynamic(
  () => import("@/components/ui/skill/seasonal-skill-chart"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Skill Chart by Season</h1>
        <div className="mb-4">
          <div className="w-[200px] h-10 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="h-[700px] bg-white p-4 rounded-xl shadow">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading chart component...</p>
            </div>
          </div>
        </div>
      </div>
    ),
  }
);

export default function Page() {
  return (
    <div className="w-full">
      <SeasonalSkillChart />
    </div>
  );
}
