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
// ---------------------------------
// Overwrite
// ---------------------------------

// CREATE TABLE IF NOT EXISTS
// async function seed(client) {
//   const createTable = await client.sql`
//     DROP TABLE IF EXISTS mk_form_data;
//     CREATE TABLE IF NOT EXISTS mk_form_data (
//       id SERIAL PRIMARY KEY
//       ,TIMESTAMP TIMESTAMP WITH TIME ZONE DEFAULT (timezone('utc', now()))
//       ,NEW_SESSION VARCHAR(255) NOT NULL
//       ,SUID SERIAL NOT NULL
//       ,MAP VARCHAR(255) NOT NULL
//       ,PLAYERS SMALLINT NOT NULL
//       ,PLAYERS_1ST VARCHAR(255) NOT NULL
//       ,PLAYERS_2ND VARCHAR(255) NOT NULL
//       ,PLAYERS_3RD VARCHAR(255)
//       ,PLAYERS_4TH VARCHAR(255)
//       ,CHARACTERS_1ST VARCHAR(255) NOT NULL
//       ,CHARACTERS_2ND VARCHAR(255) NOT NULL
//       ,CHARACTERS_3RD VARCHAR(255)
//       ,CHARACTERS_4TH VARCHAR(255)
//       ,SEASON SMALLINT NOT NULL
//     );
//   `;

//   const seedData = await parseCSV("./form_data_migration/form_data_valid.csv");

//   // Insert into database
//   const promises = seedData.map((record) => {
//     return client.sql`
//   INSERT INTO mk_form_data (
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
//     SEASON
//   ) VALUES (
//     ${record["TIMESTAMP"]},
//     ${record["NEW_SESSION"]},
//     ${record["SUID"]},
//     ${record["MAP"]},
//     ${record["PLAYERS"]},
//     ${record["PLAYERS_1ST"]},
//     ${record["PLAYERS_2ND"]},
//     ${record["PLAYERS_3RD"]},
//     ${record["PLAYERS_4TH"]},
//     ${record["CHARACTERS_1ST"]},
//     ${record["CHARACTERS_2ND"]},
//     ${record["CHARACTERS_3RD"]},
//     ${record["CHARACTERS_4TH"]},
//     ${record["SEASON"]}
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

// ---------------------------------
// Update
// ---------------------------------
// async function seed(client) {
//   const createTable = await client.sql`
//     CREATE TABLE IF NOT EXISTS mk_form_data (
//       id SERIAL PRIMARY KEY
//       ,TIMESTAMP TIMESTAMP WITH TIME ZONE DEFAULT (timezone('utc', now()))
//       ,NEW_SESSION VARCHAR(255) NOT NULL
//       ,SUID SERIAL NOT NULL
//       ,MAP VARCHAR(255) NOT NULL
//       ,PLAYERS SMALLINT NOT NULL
//       ,PLAYERS_1ST VARCHAR(255) NOT NULL
//       ,PLAYERS_2ND VARCHAR(255) NOT NULL
//       ,PLAYERS_3RD VARCHAR(255)
//       ,PLAYERS_4TH VARCHAR(255)
//       ,CHARACTERS_1ST VARCHAR(255) NOT NULL
//       ,CHARACTERS_2ND VARCHAR(255) NOT NULL
//       ,CHARACTERS_3RD VARCHAR(255)
//       ,CHARACTERS_4TH VARCHAR(255)
//       ,SEASON SMALLINT NOT NULL
//     );
//   `;

//   const seedData = await parseCSV(
//     "./form_data_migration/form_data_valid_new_records.csv"
//   );

//   // Insert into database
//   const promises = seedData.map((record) => {
//     return client.sql`
//     INSERT INTO mk_form_data (
//       TIMESTAMP,
//       NEW_SESSION,
//       SUID,
//       MAP,
//       PLAYERS,
//       PLAYERS_1ST,
//       PLAYERS_2ND,
//       PLAYERS_3RD,
//       PLAYERS_4TH,
//       CHARACTERS_1ST,
//       CHARACTERS_2ND,
//       CHARACTERS_3RD,
//       CHARACTERS_4TH,
//       SEASON
//     ) VALUES (
//       ${record["TIMESTAMP"]},
//       ${record["NEW_SESSION"]},
//       ${record["SUID"]},
//       ${record["MAP"]},
//       ${record["PLAYERS"]},
//       ${record["PLAYERS_1ST"]},
//       ${record["PLAYERS_2ND"]},
//       ${record["PLAYERS_3RD"]},
//       ${record["PLAYERS_4TH"]},
//       ${record["CHARACTERS_1ST"]},
//       ${record["CHARACTERS_2ND"]},
//       ${record["CHARACTERS_3RD"]},
//       ${record["CHARACTERS_4TH"]},
//       ${record["SEASON"]}
//     );
//     `;
//   });

//   const results = await Promise.all(promises);
//   console.log(`Seeded Records: ${results.length}`);

//   return {
//     createTable,
//     seededRecords: results.length,
//   };
// }

// ------------------------------------------------------------------
// Maps
// ------------------------------------------------------------------

// CREATE TABLE IF NOT EXISTS
// async function seed(client) {
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

async function seed(client) {
  const createTable = await client.sql`
    DROP TABLE IF EXISTS mk_characters;
    CREATE TABLE IF NOT EXISTS mk_characters (
      id SERIAL PRIMARY KEY
      ,CHARACTER VARCHAR(255) NOT NULL
      ,IMAGE_URL_ICON VARCHAR(255) NOT NULL
      ,IMAGE_URL_PORTRAIT_WON VARCHAR(255) NOT NULL
      ,IMAGE_URL_PORTRAIT_LOST VARCHAR(255) NOT NULL
      ,TYPE VARCHAR(255) NOT NULL
    );
  `;

  const seedData = await parseCSV("./form_data_migration/characters_valid.csv");

  // Insert into database
  const promises = seedData.map((record) => {
    return client.sql`
  INSERT INTO mk_characters (
    CHARACTER,
    IMAGE_URL_ICON,
    IMAGE_URL_PORTRAIT_WON,
    IMAGE_URL_PORTRAIT_LOST,
    TYPE
  ) VALUES (
    ${record["CHARACTER"]},
    ${record["IMAGE_URL_ICON"]},
    ${record["IMAGE_URL_PORTRAIT_WON"]},
    ${record["IMAGE_URL_PORTRAIT_LOST"]},
    ${record["TYPE"]}
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

async function main() {
  const client = await db.connect();
  try {
    await seed(client);
  } finally {
    await client.end();
  }
}

main().catch(console.error);
