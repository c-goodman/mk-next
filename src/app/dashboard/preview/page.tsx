import { fetchEloPerSeason } from "@/app/lib/data";
import { Suspense } from "react";

export default async function Page() {
  const elo = await fetchEloPerSeason(19);

  // const [elo, setElo] = useState<TEloSeasonTable[]>();

  // useEffect(() => {
  //   async function setEloInitial() {
  //     const eloInitial = await fetchEloPerSeason(19);

  //     if (eloInitial) {
  //       setElo(eloInitial);
  //     }
  //   }

  //   setEloInitial();
  // }, []);

  return (
    <>
      <h1>Preview Components Under Development</h1>
      <br />
      <Suspense fallback={<div>Loading...</div>}>
        {elo?.map((row) => (
          <div key={row.id}>
            {row.player_id} — {row.rating}
          </div>
        ))}
      </Suspense>
    </>
  );
}
