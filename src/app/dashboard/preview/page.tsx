"use client";

import { fetchMostRecentGame } from "@/app/lib/data";
import { useEffect, useState } from "react";

export default function Page() {
  // Set initial states for character and map table fetch
  const [mostRecentGame, setMostRecentGameData] = useState({
    id: 0,
    timestamp: new Date(),
    new_session: "",
    map: "",
    players: 0,
    players_1st: "",
    players_2nd: "",
    players_3rd: "",
    players_4th: "",
    characters_1st: "",
    characters_2nd: "",
    characters_3rd: "",
    characters_4th: "",
    season: 0,
  });

  // Load characters and maps images url paths from database with useEffect
  useEffect(() => {
    // https://stackoverflow.com/a/67547285
    async function setData() {
      const mostRecentGameInitial = await fetchMostRecentGame();

      setMostRecentGameData(mostRecentGameInitial);
    }

    setData();
  }, [setMostRecentGameData]);

  // Set the date to 7 AM UTC
  const newSessionCutoff = new Date();
  newSessionCutoff.setUTCHours(12, 0, 0, 0);

  console.log(newSessionCutoff.toUTCString());
  console.log(newSessionCutoff);

  console.log(mostRecentGame.timestamp);
  console.log(mostRecentGame.timestamp.toUTCString());

  if (mostRecentGame.timestamp < newSessionCutoff) {
    console.log("tits")
  } else {
    console.log("balls")
  }

  return <h1>Preview Components Under Development</h1>;
}
