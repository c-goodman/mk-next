import { db } from "@vercel/postgres";
import fs from "fs";
import path from "path";
import Papa from "papaparse";

import "../envConfig.mjs";

const parseCSV = async (filePath: string) => {
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

// async function seed(client) {
//   const createUsersTable = await client.sql`
//     CREATE TABLE IF NOT EXISTS mk_form_data (
//       id SERIAL PRIMARY KEY,

    
//     )
  
//   `
// }