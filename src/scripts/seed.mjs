import { db } from "@vercel/postgres";
import fs from "fs";
import path from "path";
import Papa from "papaparse";

import "../../envConfig.mjs";

const parseCSV = async (filePath) => {
  const csvFile = fs.readFileSync(path.resolve(filePath), "utf8");
  return new Promise((resolve) => {
    Papa.parse(csvFile, {
      header: true,
      complete: (results) => {
        resolve(results.data);
      },
    });
  });
};

// ------------------------------------------------------------------
// Games
// ------------------------------------------------------------------
async function seed_mk_form_data(client, if_exists = "append", source) {
  const createTable =
    if_exists === "replace"
      ? await client.sql`
    DROP TABLE IF EXISTS mk_form_data;
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
  `
      : await client.sql`
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

  const seedData = await parseCSV(source);

  // Insert into database
  const promises = seedData.map((record) => {
    return client.sql`
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
    ) VALUES (
      ${record["TIMESTAMP"]},
      ${record["NEW_SESSION"]},
      ${record["SUID"]},
      ${record["MAP"]},
      ${record["PLAYERS"]},
      ${record["PLAYERS_1ST"]},
      ${record["PLAYERS_2ND"]},
      ${record["PLAYERS_3RD"]},
      ${record["PLAYERS_4TH"]},
      ${record["CHARACTERS_1ST"]},
      ${record["CHARACTERS_2ND"]},
      ${record["CHARACTERS_3RD"]},
      ${record["CHARACTERS_4TH"]},
      ${record["SEASON"]},
      ${record["SUID_WINDOW_START"]},
      ${record["SUID_WINDOW_END"]}
    );
    `;
  });

  const results = await Promise.all(promises);
  console.log(`Seeded Records: ${results.length}`);

  return {
    createTable,
    seededRecords: results.length,
  };
}

// ------------------------------------------------------------------
// Elo
// ------------------------------------------------------------------
async function seed_elo_per_season(client, if_exists = "append", source) {
  const createTable =
    if_exists === "replace"
      ? await client.sql`
    DROP TABLE IF EXISTS mk_elo_per_season;
    CREATE TABLE IF NOT EXISTS mk_elo_per_season (
      id SERIAL PRIMARY KEY
      ,player_id VARCHAR(255) NOT NULL
      ,date TIMESTAMP WITH TIME ZONE DEFAULT (timezone('utc', now()))
      ,rating REAL NOT NULL
      ,season SMALLINT NOT NULL
      ,players SMALLINT NOT NULL
    );
  `
      : await client.sql`
    CREATE TABLE IF NOT EXISTS mk_elo_per_season (
      id SERIAL PRIMARY KEY
      ,player_id VARCHAR(255) NOT NULL
      ,date TIMESTAMP WITH TIME ZONE DEFAULT (timezone('utc', now()))
      ,rating REAL NOT NULL
      ,season SMALLINT NOT NULL
      ,players SMALLINT NOT NULL
    );
  `;

  const seedData = await parseCSV(source);

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
      ${record["player_id"]},
      ${record["date"]},
      ${record["rating"]},
      ${record["season"]},
      ${record["players"]}
    );
    `;
  });

  const results = await Promise.all(promises);
  console.log(`Seeded Records: ${results.length}`);

  return {
    createTable,
    seededRecords: results.length,
  };
}

async function seed_elo_per_map(client, if_exists = "append", source) {
  const createTable =
    if_exists === "replace"
      ? await client.sql`
    DROP TABLE IF EXISTS mk_elo_per_map;
    CREATE TABLE IF NOT EXISTS mk_elo_per_map (
      id SERIAL PRIMARY KEY
      ,player_id VARCHAR(255) NOT NULL
      ,date TIMESTAMP WITH TIME ZONE DEFAULT (timezone('utc', now()))
      ,rating REAL NOT NULL
      ,map VARCHAR(255) NOT NULL
      ,players SMALLINT NOT NULL
    );
  `
      : await client.sql`
    CREATE TABLE IF NOT EXISTS mk_elo_per_map (
      id SERIAL PRIMARY KEY
      ,player_id VARCHAR(255) NOT NULL
      ,date TIMESTAMP WITH TIME ZONE DEFAULT (timezone('utc', now()))
      ,rating REAL NOT NULL
      ,map VARCHAR(255) NOT NULL
      ,players SMALLINT NOT NULL
    );
  `;

  const seedData = await parseCSV(source);

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
      ${record["player_id"]},
      ${record["date"]},
      ${record["rating"]},
      ${record["map"]},
      ${record["players"]}
    );
    `;
  });

  const results = await Promise.all(promises);
  console.log(`Seeded Records: ${results.length}`);

  return {
    createTable,
    seededRecords: results.length,
  };
}

// ------------------------------------------------------------------
// Maps
// ------------------------------------------------------------------

// CREATE TABLE IF NOT EXISTS
// async function seed_maps(client) {
//   const createTable = await client.sql`
//     DROP TABLE IF EXISTS mk_maps;
//     CREATE TABLE IF NOT EXISTS mk_maps (
//       id SERIAL PRIMARY KEY
//       ,MAP VARCHAR(255) NOT NULL
//       ,IMAGE_URL VARCHAR(255) NOT NULL
//     );
//   `;

//   const seedData = await parseCSV("./form_data_migration/maps_valid.csv");

//   // Insert into database
//   const promises = seedData.map((record) => {
//     return client.sql`
//   INSERT INTO mk_maps (
//     MAP,
//     IMAGE_URL
//   ) VALUES (
//     ${record["MAP"]},
//     ${record["IMAGE_URL"]}
//   );
//   `;
//   });

//   const results = await Promise.all(promises);
//   console.log(`Seeded Records: ${results.length}`);

//   return {
//     createTable,
//     seededRecords: results.length,
//   };
// }

// ------------------------------------------------------------------
// Characters
// ------------------------------------------------------------------

// async function seed_characters(client) {
//   const createTable = await client.sql`
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

//   const seedData = await parseCSV("./form_data_migration/characters_valid.csv");

//   // Insert into database
//   const promises = seedData.map((record) => {
//     return client.sql`
//   INSERT INTO mk_characters (
//     CHARACTER,
//     IMAGE_URL_ICON,
//     IMAGE_URL_PORTRAIT_WON,
//     IMAGE_URL_PORTRAIT_LOST,
//     TYPE
//   ) VALUES (
//     ${record["CHARACTER"]},
//     ${record["IMAGE_URL_ICON"]},
//     ${record["IMAGE_URL_PORTRAIT_WON"]},
//     ${record["IMAGE_URL_PORTRAIT_LOST"]},
//     ${record["TYPE"]}
//   );
//   `;
//   });

//   const results = await Promise.all(promises);
//   console.log(`Seeded Records: ${results.length}`);

//   return {
//     createTable,
//     seededRecords: results.length,
//   };
// }

async function main() {
  const client = await db.connect();
  try {
    await seed_mk_form_data(
      client,
      "replace",
      "./form_data_migration/form_data_valid.csv"
    );
    // await seed_mk_form_data(
    //   client,
    //   "append",
    //   "./form_data_migration/form_data_valid_new_records.csv"
    // );

    // await seed_elo_per_season(
    //   client,
    //   "replace",
    //   "./form_data_migration/elo_per_season.csv"
    // );
    // // await seed_elo_per_season(client, "append");

    // await seed_elo_per_map(
    //   client,
    //   "replace",
    //   "./form_data_migration/elo_per_map.csv"
    // );
    // // await seed_elo_per_map(
    // //   client,
    // //   "append",
    // //   "./form_data_migration/elo_per_map.csv"
    // // );

    // await seed_maps(client);
    // await seed_characters(client);
  } finally {
    await client.release();
  }
}

main().catch(console.error);
