import SeasonalSkillChart from "@/components/ui/skill/seasonal-skill-chart";
import { Suspense } from "react";

export default async function Page() {
  return (
    <div className="w-full">
      <Suspense>
        <SeasonalSkillChart />
      </Suspense>
    </div>
  );
}
