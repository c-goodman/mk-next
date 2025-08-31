import { createSkillProcessor } from "./skill";
import { db, VercelPoolClient } from "@vercel/postgres";
import { TGamesTable } from "@/app/lib/definitions";
import "dotenv/config";

type TSeedTableProps = {
  client: VercelPoolClient;
  if_exists: "append" | "replace";
  game_type: "2" | "3" | "4";
};

async function seed_skill_all_time({
  client,
  if_exists,
  game_type,
}: TSeedTableProps) {
  const processor = createSkillProcessor();

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
        WHERE mk_form_data.players = ${game_type}
    `;

  // Process each game
  for (const game of games.rows) {
    processor.processGame(game);
  }

  const allHistoryRows = processor.getHistory();

  console.log(`Processed ${games.rows.length} games`);

  await client.sql`BEGIN`;
  try {
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

    for (const row of allHistoryRows) {
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
    console.log(
      `Inserted ${allHistoryRows.length} rows into mk_skill_all_time_four_player`
    );
  } catch (error) {
    // await client.sql`ROLLBACK`;
    console.error("Bulk insert failed:", error);
    throw error;
  }
}

async function seed_skill_seasonal({
  client,
  if_exists,
  game_type,
}: TSeedTableProps) {
  const processor = createSkillProcessor();

  console.log("create");
  const createTable =
    if_exists === "replace"
      ? await client.sql`
      DROP TABLE IF EXISTS mk_skill_seasonal_four_player;
      CREATE TABLE IF NOT EXISTS mk_skill_seasonal_four_player (
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
      CREATE TABLE IF NOT EXISTS mk_skill_seasonal_four_player (
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

  console.log("games");
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
        WHERE mk_form_data.players = ${game_type}
    `;

  // Reset the ratings at the start of each season
  let lastSeason = null;
  for (const game of games.rows) {
    if (game.season !== lastSeason) {
      processor.resetRatings(); // Reset skill for new season
      lastSeason = game.season;
    }
    processor.processGame(game);
  }

  const allHistoryRows = processor.getHistory();

  console.log(`Processed ${games.rows.length} games`);

  await client.sql`BEGIN`;
  try {
    const insertQuery = `
    INSERT INTO mk_skill_seasonal_four_player (
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

    for (const row of allHistoryRows) {
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
    console.log(
      `Inserted ${allHistoryRows.length} rows into mk_skill_seasonal_four_player`
    );
  } catch (error) {
    // await client.sql`ROLLBACK`;
    console.error("Bulk insert failed:", error);
    throw error;
  }
}

// to run script `pnpm dlx tsx src/scripts/seed_skill.ts`
async function main() {
  const client = await db.connect();
  try {
    // ---------------------------------------------------------
    // 4 Player
    // ---------------------------------------------------------
    // All Time
    // -----------------------------
    // await seed_skill_all_time({
    //   client: client,
    //   if_exists: "replace",
    //   game_type: "4",
    // });
    // await seed_skill_all_time_four_player(client, "append");

    // Per Season
    // -----------------------------
    console.log("here");
    await seed_skill_seasonal({
      client: client,
      if_exists: "replace",
      game_type: "4",
    });
    // await seed_skill_seasonal_four_player(client, "append");

    // ---------------------------------------------------------
    // 3 Player
    // ---------------------------------------------------------
  } finally {
    await client.release();
  }
}

main().catch(console.error);
