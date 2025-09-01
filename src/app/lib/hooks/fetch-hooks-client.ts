"use client";

import { useEffect, useState } from "react";
import { fetchSkillPerSeasonFourPlayer, fetchUniqueSeasonsIds } from "../data";
import { TSkillTable } from "../definitions";

export function useFetchSkillSeasonFourPlayer(
  season: number
): TSkillTable[] | undefined {
  const [data, setData] = useState<TSkillTable[] | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;

    fetchSkillPerSeasonFourPlayer(season)
      .then((res) => {
        if (isMounted) setData(res ?? []);
      })
      .catch(() => {
        if (isMounted) setData([]);
      });

    return () => {
      isMounted = false;
    };
  }, [season]);

  return data;
}

export function useFetchUniqueSeasonsIds(): number[] | undefined {
  const [seasons, setSeasons] = useState<number[] | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;

    fetchUniqueSeasonsIds()
      .then((data) => {
        if (isMounted) setSeasons(data ?? []);
      })
      .catch(() => {
        if (isMounted) setSeasons([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return seasons;
}
