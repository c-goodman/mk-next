import fs from "fs";
import Papa from "papaparse";
import path from "path";
import { db, VercelPoolClient } from "@vercel/postgres";
import { TEloSeasonTable } from "../app/lib/definitions";
import "dotenv/config";
import {
  //   TCharactersTable,
  TEloMapsTable,
  TGamesTable,
  //   TMapsTable,
} from "@/app/lib/definitions";

const parseCSV = async <T extends object>(filePath: string): Promise<T[]> => {
  const csvFile = fs.readFileSync(path.resolve(filePath), "utf8");
  return new Promise<T[]>((resolve) => {
    Papa.parse<T>(csvFile, {
      header: true,
      complete: (results) => {
        resolve(results.data);
      },
    });
  });
};

type TCSVSeedTableProps = {
  client: VercelPoolClient;
  if_exists: "append" | "replace";
  source: string;
};

type TGamesTableEntry = Omit<TGamesTable, "id" | "image_url">;
type TEloSeasonTableEntry = Omit<TEloSeasonTable, "id">;
type TTEloMapsTableEntry = Omit<TEloMapsTable, "id">;
// type TMapsTableEntry = Omit<TMapsTable, "id">;
// type TCharactersTableEntry = Omit<TCharactersTable, "id">;

// ------------------------------------------------------------------
// Games
// ------------------------------------------------------------------
async function seed_mk_form_data({
  client,
  if_exists,
  source,
}: TCSVSeedTableProps) {
  await client.sql`BEGIN`;

  if (if_exists === "replace") {
    await client.sql`
    DROP TABLE IF EXISTS mk_form_data;
  `;
  }

  await client.sql`
    CREATE TABLE IF NOT EXISTS mk_form_data (
      id SERIAL PRIMARY KEY
      ,TIMESTAMP TIMESTAMP WITH TIME ZONE DEFAULT (timezone('utc', now()))
      ,NEW_SESSION VARCHAR(255) NOT NULL
      ,SUID SERIAL NOT NULL
      ,MAP VARCHAR(255) NOT NULL
      ,PLAYERS SMALLINT NOT NULL
      ,PLAYERS_1ST VARCHAR(255) NOT NULL
      ,PLAYERS_2ND VARCHAR(255) NOT NULL
      ,PLAYERS_3RD VARCHAR(255)
      ,PLAYERS_4TH VARCHAR(255)
      ,CHARACTERS_1ST VARCHAR(255) NOT NULL
      ,CHARACTERS_2ND VARCHAR(255) NOT NULL
      ,CHARACTERS_3RD VARCHAR(255)
      ,CHARACTERS_4TH VARCHAR(255)
      ,SEASON SMALLINT NOT NULL
      ,SUID_WINDOW_START TIMESTAMP WITH TIME ZONE DEFAULT (timezone('utc', now()))
      ,SUID_WINDOW_END TIMESTAMP WITH TIME ZONE DEFAULT (timezone('utc', now()))
    );
  `;

  // Index a commonly queried column for performance
  //   await client.sql`
  //     CREATE INDEX IF NOT EXISTS idx_
  //         ON mk_form_data(id);
  //   `;

  const seedData = await parseCSV<TGamesTableEntry>(source);

  try {
    // // Insert into database
    // const promises = seedData.map((record) => {
    //   return client.sql`
    //     INSERT INTO mk_form_data (
    //     TIMESTAMP,
    //     NEW_SESSION,
    //     SUID,
    //     MAP,
    //     PLAYERS,
    //     PLAYERS_1ST,
    //     PLAYERS_2ND,
    //     PLAYERS_3RD,
    //     PLAYERS_4TH,
    //     CHARACTERS_1ST,
    //     CHARACTERS_2ND,
    //     CHARACTERS_3RD,
    //     CHARACTERS_4TH,
    //     SEASON,
    //     SUID_WINDOW_START,
    //     SUID_WINDOW_END
    //     ) VALUES (
    //     ${
    //       record.timestamp instanceof Date
    //         ? record.timestamp.toISOString()
    //         : record.timestamp
    //     },
    //     ${record.new_session},
    //     ${record.suid},
    //     ${record.map},
    //     ${record.players},
    //     ${record.players_1st},
    //     ${record.players_2nd},
    //     ${record.players_3rd},
    //     ${record.players_4th},
    //     ${record.characters_1st},
    //     ${record.characters_2nd},
    //     ${record.characters_3rd},
    //     ${record.characters_4th},
    //     ${record.season},
    //     ${
    //       record.suid_window_start instanceof Date
    //         ? record.suid_window_start.toISOString()
    //         : record.suid_window_start
    //     },
    //     ${
    //       record.suid_window_end instanceof Date
    //         ? record.suid_window_end.toISOString()
    //         : record.suid_window_end
    //     }
    //     );
    // `;
    // });

    // const results = await Promise.all(promises);

    const insertQuery = `
    INSERT INTO mk_form_data (
        TIMESTAMP,
        NEW_SESSION,
        SUID,
        MAP,
        PLAYERS,
        PLAYERS_1ST,
        PLAYERS_2ND,
        PLAYERS_3RD,
        PLAYERS_4TH,
        CHARACTERS_1ST,
        CHARACTERS_2ND,
        CHARACTERS_3RD,
        CHARACTERS_4TH,
        SEASON,
        SUID_WINDOW_START,
        SUID_WINDOW_END
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
  `;

    for (const row of seedData) {
      await client.query(insertQuery, [
        row.timestamp,
        row.new_session,
        row.suid,
        row.map,
        row.players,
        row.players_1st,
        row.players_2nd,
        row.players_3rd,
        row.players_4th,
        row.characters_1st,
        row.characters_2nd,
        row.characters_3rd,
        row.characters_4th,
        row.season,
        row.suid_window_start,
        row.suid_window_end,
      ]);
    }

    await client.sql`COMMIT`;
    console.log(`Inserted ${seedData.length} rows into mk_form_data`);
  } catch (error) {
    await client.sql`ROLLBACK`;
    console.error("Insert failed (mk_form_data):", error);
    throw error;
  }
}

// ------------------------------------------------------------------
// Elo
// ------------------------------------------------------------------
async function seed_elo_per_season({
  client,
  if_exists,
  source,
}: TCSVSeedTableProps) {
  await client.sql`BEGIN`;

  if (if_exists === "replace") {
    await client.sql`
    DROP TABLE IF EXISTS mk_elo_per_season;
  `;
  }

  await client.sql`
    CREATE TABLE IF NOT EXISTS mk_elo_per_season (
      id SERIAL PRIMARY KEY
      ,player_id VARCHAR(255) NOT NULL
      ,date TIMESTAMP WITH TIME ZONE DEFAULT (timezone('utc', now()))
      ,rating REAL NOT NULL
      ,season SMALLINT NOT NULL
      ,players SMALLINT NOT NULL
    );
  `;

  // Index a commonly queried column for performance
  //   await client.sql`
  //     CREATE INDEX IF NOT EXISTS idx_
  //         ON mk_elo_per_season(id);
  //   `;

  const seedData = await parseCSV<TEloSeasonTableEntry>(source);

  try {
    // Insert into database
    const promises = seedData.map((record) => {
      return client.sql`
    INSERT INTO mk_elo_per_season (
      player_id,
      date,
      rating,
      season,
      players
    ) VALUES (
      ${record.player_id},
      ${record.date instanceof Date ? record.date.toISOString() : record.date},
      ${record.rating},
      ${record.season},
      ${record.players}
    );
    `;
    });

    const results = await Promise.all(promises);
    await client.sql`COMMIT`;
    console.log(`Inserted ${results.length} rows into mk_elo_per_season`);
  } catch (error) {
    await client.sql`ROLLBACK`;
    console.error("Insert failed (mk_elo_per_season):", error);
    throw error;
  }
}

async function seed_elo_per_map({
  client,
  if_exists,
  source,
}: TCSVSeedTableProps) {
  await client.sql`BEGIN`;

  if (if_exists === "replace") {
    await client.sql`
    DROP TABLE IF EXISTS mk_elo_per_map;
  `;
  }

  await client.sql`
    CREATE TABLE IF NOT EXISTS mk_elo_per_map (
      id SERIAL PRIMARY KEY
      ,player_id VARCHAR(255) NOT NULL
      ,date TIMESTAMP WITH TIME ZONE DEFAULT (timezone('utc', now()))
      ,rating REAL NOT NULL
      ,map VARCHAR(255) NOT NULL
      ,players SMALLINT NOT NULL
    );
  `;

  const seedData = await parseCSV<TTEloMapsTableEntry>(source);

  try {
    // Insert into database
    const promises = seedData.map((record) => {
      return client.sql`
    INSERT INTO mk_elo_per_map (
      player_id,
      date,
      rating,
      map,
      players
    ) VALUES (
      ${record.player_id},
      ${record.date instanceof Date ? record.date.toISOString() : record.date},
      ${record.rating},
      ${record.map},
      ${record.players}
    );
    `;
    });

    const results = await Promise.all(promises);
    await client.sql`COMMIT`;
    console.log(`Inserted ${results.length} rows into mk_elo_per_map`);
  } catch (error) {
    await client.sql`ROLLBACK`;
    console.error("Insert failed (mk_elo_per_map):", error);
    throw error;
  }
}

// ------------------------------------------------------------------
// Maps
// ------------------------------------------------------------------
// async function seed_maps({
//   client,
//   source,
// }: {
//   client: VercelPoolClient;
//   source: string;
// }) {
//   await client.sql`
//     DROP TABLE IF EXISTS mk_maps;
//     CREATE TABLE IF NOT EXISTS mk_maps (
//       id SERIAL PRIMARY KEY
//       ,MAP VARCHAR(255) NOT NULL
//       ,IMAGE_URL VARCHAR(255) NOT NULL
//     );
//   `;

//   // "./form_data_migration/maps_valid.csv"
//   const seedData = await parseCSV<TMapsTableEntry>(source);

//   await client.sql`BEGIN`;
//   try {
//     // Insert into database
//     const promises = seedData.map((record) => {
//       return client.sql`
//     INSERT INTO mk_maps (
//         MAP,
//         IMAGE_URL
//     ) VALUES (
//         ${record.map},
//         ${record.image_url}
//     );
//     `;
//     });

//     const results = await Promise.all(promises);
//     await client.sql`COMMIT`;
//     console.log(`Inserted ${results.length} rows into mk_maps`);
//   } catch (error) {
//     await client.sql`ROLLBACK`;
//     console.error("Insert failed (mk_maps):", error);
//     throw error;
//   }
// }

// ------------------------------------------------------------------
// Characters
// ------------------------------------------------------------------
// async function seed_characters({
//   client,
//   source,
// }: {
//   client: VercelPoolClient;
//   source: string;
// }) {
//   await client.sql`
//     DROP TABLE IF EXISTS mk_characters;
//     CREATE TABLE IF NOT EXISTS mk_characters (
//       id SERIAL PRIMARY KEY
//       ,CHARACTER VARCHAR(255) NOT NULL
//       ,IMAGE_URL_ICON VARCHAR(255) NOT NULL
//       ,IMAGE_URL_PORTRAIT_WON VARCHAR(255) NOT NULL
//       ,IMAGE_URL_PORTRAIT_LOST VARCHAR(255) NOT NULL
//       ,TYPE VARCHAR(255) NOT NULL
//     );
//   `;

//   // "./form_data_migration/characters_valid.csv"
//   const seedData = await parseCSV<TCharactersTableEntry>(source);

//   await client.sql`BEGIN`;
//   try {
//     // Insert into database
//     const promises = seedData.map((record) => {
//       return client.sql`
//     INSERT INTO mk_characters (
//         CHARACTER,
//         IMAGE_URL_ICON,
//         IMAGE_URL_PORTRAIT_WON,
//         IMAGE_URL_PORTRAIT_LOST,
//         TYPE
//     ) VALUES (
//         ${record.character},
//         ${record.image_url_icon},
//         ${record.image_url_portrait_won},
//         ${record.image_url_portrait_lost},
//         ${record.type}
//     );
//     `;
//     });

//     const results = await Promise.all(promises);
//     await client.sql`COMMIT`;
//     console.log(`Inserted ${results.length} rows into mk_characters`);
//   } catch (error) {
//     await client.sql`ROLLBACK`;
//     console.error("Insert failed (mk_characters):", error);
//     throw error;
//   }
// }

async function main() {
  const client = await db.connect();

  try {
    await seed_mk_form_data({
      client: client,
      if_exists: "append",
      source: "./form_data_migration/form_data_valid_new_records.csv",
    });
    // Optionally re-migrate
    // await seed_mk_form_data({
    //   client: client,
    //   if_exists: "replace",
    //   source: "./form_data_migration/form_data_valid.csv",
    // });

    // // re-migrate
    // await seed_elo_per_season({
    //   client: client,
    //   if_exists: "replace",
    //   source: "./form_data_migration/elo_per_season.csv",
    // });

    // // re-migrate
    // await seed_elo_per_map({
    //   client: client,
    //   if_exists: "replace",
    //   source: "./form_data_migration/elo_per_map.csv",
    // });

    // await seed_maps({
    //   client: client,
    //   source: "./form_data_migration/maps_valid.csv",
    // });
    // await seed_characters({
    //   client: client,
    //   source: "./form_data_migration/characters_valid.csv",
    // });
  } catch (error) {
    throw error;
  } finally {
    await client.release();
  }
}

main().catch(console.error);
