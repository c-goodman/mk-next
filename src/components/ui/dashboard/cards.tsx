import { fetchGamesCounts } from "@/app/lib/data";
import { lusitana } from "@/components/ui/fonts";
import {
  ClockIcon,
  UserGroupIcon,
  FireIcon,
  FlagIcon,
} from "@heroicons/react/24/outline";

const iconMap = {
  current: FireIcon,
  remaining: ClockIcon,
  total: FlagIcon,
  users: UserGroupIcon,
};

export default async function CardWrapper() {
  const {
    totalNumberOfGames,
    totalNumberOfUsers,
    currentSeasonNumberOfGames,
    currentSeason,
    currentSeasonNumberOfGamesRemaining,
  } = await fetchGamesCounts();

  return (
    <>
      <Card
        title={`S${currentSeason} Games`}
        value={currentSeasonNumberOfGames}
        type="current"
      />
      <Card
        title={`S${currentSeason} Games Remaining`}
        value={currentSeasonNumberOfGamesRemaining}
        type="remaining"
      />
      <Card title="Total Games" value={totalNumberOfGames} type="total" />
      <Card title="Total Users" value={totalNumberOfUsers} type="users" />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: "current" | "remaining" | "total" | "users";
}) {
  const Icon = iconMap[type];

  return (
    <div className="h-fit rounded-xl bg-gray-50 p-1 shadow-sm">
      <div className="flex h-fit p-2">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
            h-fit truncate rounded-xl bg-white p-2 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
