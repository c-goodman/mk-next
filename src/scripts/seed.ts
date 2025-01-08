import { db, VercelPoolClient } from "@vercel/postgres";
import fs from "fs";
import path from "path";
import Papa from "papaparse";

import "../envConfig.mjs";

interface FormData {
  TIMESTAMP: Date;
  NEW_SESSION: string;
  MAP: string;
  PLAYERS: number;
  PLAYERS_1ST: string;
  PLAYERS_2ND: string;
  PLAYERS_3RD: string;
  PLAYERS_4TH: string;
  CHARACTERS_1ST: string;
  CHARACTERS_2ND: string;
  CHARACTERS_3RD: string;
  CHARACTERS_4TH: string;
}

const parseCSV = async (
  filePath: string
): Promise<Papa.ParseResult<FormData>> => {
  const csvFile = fs.readFileSync(path.resolve(filePath), "utf8");
  return new Promise((resolve) => {
    Papa.parse(csvFile, {
      header: true,
      complete: (results: any) => {
        resolve(results.data);
      },
    });
  });
};

async function seed(client: VercelPoolClient) {
  const createTable = await client.sql`
    CREATE TABLE IF NOT EXISTS mk_form_data (
      id SERIAL PRIMARY KEY
      ,TIMESTAMP TIMESTAMP NOT NULL
      ,NEW_SESSION VARCHAR(255) NOT NULL
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
    );
  `;

  const seedData = await parseCSV(
    "C:\\Users\\Cooper\\sandbox\\mkstream\\form_data_migration\\form_data_no_id_col.csv"
  );

  // Insert into database
  const promises = seedData.map((record: any) => {
    return client.sql`
  INSERT INTO mk_form_data (
    TIMESTAMP, 
    NEW_SESSION, 
    MAP, 
    PLAYERS, 
    PLAYERS_1ST, 
    PLAYERS_2ND, 
    PLAYERS_3RD, 
    PLAYERS_4TH, 
    CHARACTERS_1ST, 
    CHARACTERS_2ND, 
    CHARACTERS_3RD, 
    CHARACTERS_4TH
  )
  VALUES (
    ${record["TIMESTAMP"]},
    ${record["NEW_SESSION"]},
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
  )
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
