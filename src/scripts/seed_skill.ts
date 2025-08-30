import { db, VercelPoolClient } from "@vercel/postgres";
import { rating, rate, Rating, ordinal } from "openskill";
import { TGamesTable } from "@/app/lib/definitions";
import "dotenv/config";

type PlayerHistoryEntry = {
  timestamp: Date;
  game_id: number;
  suid: number;
  season: number;
  player: string;
  place: number;
  character: string;
  map: string;
  mu: number;
  sigma: number;
  ordinal: number;
};

const currentRatings: Record<string, Rating> = {};
const playerHistoryRows: PlayerHistoryEntry[] = [];

function getOrInitPlayerRating(player: string): Rating {
  if (!currentRatings[player]) {
    currentRatings[player] = rating();
  }
  return currentRatings[player];
}

type RecordHistoryParams = {
  timestamp: Date;
  game_id: number;
  suid: number;
  season: number;
  player: string;
  place: number;
  character: string;
  map: string;
};

function recordHistory({
  timestamp,
  game_id,
  suid,
  season,
  player,
  place,
  character,
  map,
}: RecordHistoryParams) {
  const r = currentRatings[player];
  playerHistoryRows.push({
    timestamp,
    game_id,
    suid,
    season,
    player,
    place,
    character,
    map,
    mu: r.mu,
    sigma: r.sigma,
    ordinal: ordinal(r),
  });
}

function processGame(game: TGamesTable) {
  const playerNames = [
    game.players_1st,
    game.players_2nd,
    game.players_3rd,
    game.players_4th,
  ];

  const playerCharacters = [
    game.characters_1st,
    game.characters_2nd,
    game.characters_3rd,
    game.characters_4th,
  ];

  const ranks = [1, 2, 3, 4];

  const ratedTeams = playerNames.map((name) => [getOrInitPlayerRating(name)]);
  const newRatings = rate(ratedTeams, { rank: ranks });

  playerNames.forEach((player, i) => {
    currentRatings[player] = newRatings[i][0];
    recordHistory({
      timestamp: game.timestamp,
      game_id: game.id,
      suid: game.suid,
      season: game.season,
      player: player,
      place: ranks[i],
      character: playerCharacters[i],
      map: game.map,
    });
  });
}

async function seed_skill_all_time_four_player(
  client: VercelPoolClient,
  if_exists = "append"
) {
  const createTable =
    if_exists === "replace"
      ? await client.sql`
    DROP TABLE IF EXISTS mk_skill_all_time_four_player;
    CREATE TABLE IF NOT EXISTS mk_skill_all_time_four_player (
      id SERIAL PRIMARY KEY
      ,TIMESTAMP TIMESTAMP WITH TIME ZONE NOT NULL
      ,GAME_ID SERIAL NOT NULL
      ,SUID SERIAL NOT NULL
      ,SEASON SMALLINT NOT NULL
      ,PLAYER VARCHAR(255) NOT NULL
      ,PLACE SMALLINT NOT NULL
      ,CHARACTER VARCHAR(255) NOT NULL
      ,MAP VARCHAR(255) NOT NULL
      ,MU DOUBLE PRECISION NOT NULL
      ,SIGMA DOUBLE PRECISION NOT NULL
      ,ORDINAL DOUBLE PRECISION NOT NULL
    );
  `
      : await client.sql`
    CREATE TABLE IF NOT EXISTS mk_skill_all_time_four_player (
      id SERIAL PRIMARY KEY
      ,TIMESTAMP TIMESTAMP WITH TIME ZONE NOT NULL
      ,GAME_ID SERIAL NOT NULL
      ,SUID SERIAL NOT NULL
      ,SEASON SMALLINT NOT NULL
      ,PLAYER VARCHAR(255) NOT NULL
      ,PLACE SMALLINT NOT NULL
      ,CHARACTER VARCHAR(255) NOT NULL
      ,MAP VARCHAR(255) NOT NULL
      ,MU DOUBLE PRECISION NOT NULL
      ,SIGMA DOUBLE PRECISION NOT NULL
      ,ORDINAL DOUBLE PRECISION NOT NULL
    );
  `;

  const games = await client.sql<TGamesTable>`
      SELECT 
        mk_form_data.id
        ,mk_form_data.timestamp
        ,mk_form_data.new_session
        ,mk_form_data.suid
        ,mk_form_data.map
        ,mk_form_data.players
        ,mk_form_data.players_1st
        ,mk_form_data.players_2nd
        ,mk_form_data.players_3rd
        ,mk_form_data.players_4th
        ,mk_form_data.characters_1st
        ,mk_form_data.characters_2nd
        ,mk_form_data.characters_3rd
        ,mk_form_data.characters_4th
        ,mk_form_data.season
        ,mk_form_data.suid_window_start
        ,mk_form_data.suid_window_end
      FROM mk_form_data
        WHERE mk_form_data.players = '4'
    `;

  // Process each game
  games.rows.forEach(processGame);

  console.log(`Processed ${games.rows.length} games`);
  console.log(`Generated ${playerHistoryRows.length} player history rows`);

  const insertQuery = `
  INSERT INTO mk_skill_all_time_four_player (
    timestamp, 
    game_id, 
    suid, season,
    player, 
    place, 
    character, 
    map,
    mu, 
    sigma, 
    ordinal
  ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
`;

  await client.sql`BEGIN`;

  for (const row of playerHistoryRows) {
    await client.query(insertQuery, [
      row.timestamp,
      row.game_id,
      row.suid,
      row.season,
      row.player,
      row.place,
      row.character,
      row.map,
      row.mu,
      row.sigma,
      row.ordinal,
    ]);
  }

  await client.sql`COMMIT`;
}

// to run script `pnpm dlx tsx src/scripts/seed_skill.ts`
async function main() {
  const client = await db.connect();
  try {
    await seed_skill_all_time_four_player(client, "replace");
    // await seed_skill_all_time_four_player(client, "append");
  } finally {
    await client.release();
  }
}

main().catch(console.error);
