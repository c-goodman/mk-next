"use server";

import { formatCurrency } from "./utils";
import { GAMES_PER_SEASON } from "../../types/constants";
import { ITEMS_PER_PAGE } from "@/types/constants";
import { sql } from "@vercel/postgres";
import {
  CustomerField,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
  TCharactersTable,
  TGamesTable,
  TMapsTable,
  TMostRecentSeasonGamesCount,
  TMostRecentSeasonGamesCountInitial,
  TUserNames,
  TUsersTable,
} from "./definitions";

export async function fetchRevenue() {
  try {
    const data = await sql<Revenue>`SELECT * FROM revenue`;
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices.");
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
  }
}

export async function fetchCustomers() {
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all customers.");
  }
}

// --------------------------------------------------------
// Users
// --------------------------------------------------------

export async function fetchUserByName(name: string) {
  try {
    const data = await sql<TUsersTable>`
      SELECT
        users.id,
        users.name,
        users.email,
        users.password
      FROM users
      WHERE users.name = ${name};
    `;

    // users.name has a unique constraint
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user.");
  }
}

export async function fetchUserByEmail(email: string) {
  try {
    const data = await sql<TUsersTable>`
      SELECT
        users.id,
        users.name,
        users.email,
        users.password
      FROM users
      WHERE users.email = ${email};
    `;

    // users.email has a unique constraint
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user.");
  }
}

export async function fetchUserNames(): Promise<string[]> {
  try {
    const data = await sql<TUserNames>`
      SELECT users.name FROM users
    `;

    const userNames = data.rows.map((name) => name.name);

    return userNames;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user.");
  }
}

// --------------------------------------------------------
// Games
// --------------------------------------------------------
export async function fetchFilteredGames(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const games = await sql<TGamesTable>`
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
        ,mk_maps.image_url
      FROM mk_form_data
      JOIN mk_maps ON mk_form_data.map = mk_maps.map
        WHERE
        mk_form_data.players_1st ILIKE ${`%${query}%`} OR
        mk_form_data.players_2nd ILIKE ${`%${query}%`} OR
        mk_form_data.players_3rd ILIKE ${`%${query}%`} OR
        mk_form_data.players_4th ILIKE ${`%${query}%`} OR
        mk_form_data.map ILIKE ${`%${query}%`} OR
        mk_form_data.season::text ILIKE ${`%${query}%`} OR
        mk_form_data.timestamp::text ILIKE ${`%${query}%`}
      ORDER BY mk_form_data.timestamp DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return games.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch games.");
  }
}

export async function fetchGamesPages(query: string) {
  try {
    const count = await sql`
    SELECT COUNT(*)
      FROM mk_form_data
        WHERE
        mk_form_data.players_1st ILIKE ${`%${query}%`} OR
        mk_form_data.players_2nd ILIKE ${`%${query}%`} OR
        mk_form_data.players_3rd ILIKE ${`%${query}%`} OR
        mk_form_data.players_4th ILIKE ${`%${query}%`} OR
        mk_form_data.map ILIKE ${`%${query}%`} OR
        mk_form_data.season::text ILIKE ${`%${query}%`} OR
        mk_form_data.timestamp::text ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    // const totalPages = Math.ceil(Number(count.rows[0].count) / 10);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of games.");
  }
}

export async function fetchGamesCounts() {
  try {
    const totalGamesCountPromise = sql`SELECT COUNT(*) FROM mk_form_data`;
    const totalUsersCountPromise = sql`SELECT COUNT(*) FROM users`;
    const currentSeasonGamesPromise = sql`
      SELECT COUNT(*) AS count, mk_form_data.season FROM mk_form_data
        GROUP BY mk_form_data.season
        ORDER BY mk_form_data.season DESC`;

    // TOTO: Make this it's own service?
    const currentSessionTimestampPromise = sql`
    SELECT 
        MAX(mk_form_data.suid) as current_suid 
        ,MAX(mk_form_data.timestamp) as current_timestamp 
      FROM mk_form_data`;

    // const invoiceStatusPromise = sql`SELECT
    //      SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
    //      SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
    //      FROM mk_form_data`;

    const data = await Promise.all([
      totalGamesCountPromise,
      totalUsersCountPromise,
      currentSeasonGamesPromise,
      currentSessionTimestampPromise,
    ]);

    const totalNumberOfGames = Number(data[0].rows[0].count ?? "0");
    const totalNumberOfUsers = Number(data[1].rows[0].count ?? "0");
    const currentSeasonNumberOfGames = Number(data[2].rows[0].count ?? "0");
    const currentSeason = Number(data[2].rows[0].season ?? "0");
    const currentSeasonNumberOfGamesRemaining =
      GAMES_PER_SEASON - currentSeasonNumberOfGames;

    const currentSessionId = Number(data[3].rows[0].current_suid ?? "0");
    const currentTimestamp = new Date(data[3].rows[0].current_timestamp ?? "0");

    return {
      totalNumberOfGames,
      totalNumberOfUsers,
      currentSeasonNumberOfGames,
      currentSeason,
      currentSeasonNumberOfGamesRemaining,
      currentSessionId,
      currentTimestamp,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch card data.");
  }
}

export async function fetchMostRecentGame(): Promise<TGamesTable> {
  try {
    const data = await sql<TGamesTable>`
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
        ORDER BY mk_form_data.timestamp DESC
        LIMIT 1;
    `;

    return data.rows[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user.");
  }
}

export async function fetchMostRecentSession(): Promise<TGamesTable[]> {
  try {
    const data = await sql<TGamesTable>`
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
        WHERE mk_form_data.suid = (
            SELECT MAX(mk_form_data.suid) FROM mk_form_data
          )
        ORDER BY mk_form_data.timestamp DESC;
    `;

    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user.");
  }
}

export async function fetchPenultimateSession(): Promise<TGamesTable[]> {
  try {
    const data = await sql<TGamesTable>`
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
        WHERE mk_form_data.suid = (
            SELECT MAX(mk_form_data.suid) - 1 FROM mk_form_data
          )
        ORDER BY mk_form_data.timestamp DESC;
    `;

    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user.");
  }
}

export async function fetchMostRecentNewSession(): Promise<TGamesTable[]> {
  try {
    const data = await sql<TGamesTable>`
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
        WHERE mk_form_data.suid = (
            SELECT MAX(mk_form_data.suid) FROM mk_form_data
          )
        AND mk_form_data.new_session = 'YES'
        ORDER BY mk_form_data.timestamp DESC;
    `;

    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user.");
  }
}

export async function fetchMostRecentSeasonGamesCount(): Promise<TMostRecentSeasonGamesCount> {
  try {
    const currentSeasonGamesPromise =
      await sql<TMostRecentSeasonGamesCountInitial>`
      SELECT COUNT(*) AS count, mk_form_data.season FROM mk_form_data
        GROUP BY mk_form_data.season
        ORDER BY mk_form_data.season DESC
        LIMIT 1;
      `;

    // Deconstruct items
    const { count, season } = currentSeasonGamesPromise.rows[0];

    // Convert counts from string to number
    return { count: Number(count), season: season };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user.");
  }
}

export async function fetchLatestGames() {
  try {
    const data = await sql<TGamesTable>`
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
        ,mk_maps.image_url
      FROM mk_form_data
      JOIN mk_maps ON mk_form_data.map = mk_maps.map
        ORDER BY mk_form_data.timestamp DESC
        LIMIT 5
      `;

    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest games.");
  }
}

export type TSessionPlacementsRolling = {
  id: number;
  suid: number;
  player_name: string;
  running_total: number;
};

export async function fetchSessionPlacementsRollingAllGameTypesFirst(): Promise<
  TSessionPlacementsRolling[]
> {
  try {
    const data = await sql<TSessionPlacementsRolling>`
      SELECT
          mk_form_data.id,
          mk_form_data.suid,
          mk_form_data.players_1st AS player_name,
          SUM(COUNT(mk_form_data.id)) OVER (
              PARTITION BY mk_form_data.players_1st, mk_form_data.suid
              ORDER BY mk_form_data.id
          ) AS running_total
      FROM
          mk_form_data
      WHERE
          mk_form_data.players IN ('2', '3', '4')
      GROUP BY
          mk_form_data.players_1st,
          mk_form_data.suid,
          mk_form_data.id
      ORDER BY
          mk_form_data.id DESC;
    `;

    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(
      "Failed to fetch SessionPlacementsRollingAllGameTypesFirst"
    );
  }
}

export async function fetchSessionPlacementsRollingTwoPlayerFirst(): Promise<
  TSessionPlacementsRolling[]
> {
  try {
    const data = await sql<TSessionPlacementsRolling>`
      SELECT
          mk_form_data.id,
          mk_form_data.suid,
          mk_form_data.players_1st AS player_name,
          SUM(CASE WHEN mk_form_data.players = '2' THEN 1 ELSE 0 END) OVER (
              PARTITION BY mk_form_data.players_1st, mk_form_data.suid, mk_form_data.players
              ORDER BY mk_form_data.id
          ) AS running_total
          
      FROM
          mk_form_data
      WHERE
          mk_form_data.players = '2'
      GROUP BY
          mk_form_data.players_1st,
          mk_form_data.suid,
          mk_form_data.id
      ORDER BY
          mk_form_data.id DESC;
    `;

    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch SessionPlacementsRollingTwoPlayerFirst");
  }
}

export async function fetchSessionPlacementsRollingThreePlayerFirst(): Promise<
  TSessionPlacementsRolling[]
> {
  try {
    const data = await sql<TSessionPlacementsRolling>`
      SELECT
          mk_form_data.id,
          mk_form_data.suid,
          mk_form_data.players_1st AS player_name,
          SUM(CASE WHEN mk_form_data.players = '3' THEN 1 ELSE 0 END) OVER (
              PARTITION BY mk_form_data.players_1st, mk_form_data.suid, mk_form_data.players
              ORDER BY mk_form_data.id
          ) AS running_total
          
      FROM
          mk_form_data
      WHERE
          mk_form_data.players = '3'
      GROUP BY
          mk_form_data.players_1st,
          mk_form_data.suid,
          mk_form_data.id
      ORDER BY
          mk_form_data.id DESC;
    `;

    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch SessionPlacementsRollingThreePlayerFirst");
  }
}

export async function fetchSessionPlacementsRollingFourPlayerFirst(): Promise<
  TSessionPlacementsRolling[]
> {
  try {
    const data = await sql<TSessionPlacementsRolling>`
      SELECT
          mk_form_data.id,
          mk_form_data.suid,
          mk_form_data.players_1st AS player_name,
          SUM(CASE WHEN mk_form_data.players = '4' THEN 1 ELSE 0 END) OVER (
              PARTITION BY mk_form_data.players_1st, mk_form_data.suid, mk_form_data.players
              ORDER BY mk_form_data.id
          ) AS running_total
          
      FROM
          mk_form_data
      WHERE
          mk_form_data.players = '4'
      GROUP BY
          mk_form_data.players_1st,
          mk_form_data.suid,
          mk_form_data.id
      ORDER BY
          mk_form_data.id DESC;
    `;

    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch SessionPlacementsRollingFourPlayerFirst");
  }
}

// export async function fetchSessionPlacementsRolling(): Promise<
//   TSessionPlacementsRolling[]
// > {
//   try {
//     const first_place = await sql<TSessionPlacementsRolling>`
//       SELECT
//           mk_form_data.id,
//           mk_form_data.suid,
//           mk_form_data.players_1st AS players_1st,

//           -- Running total for all game types combined
//           SUM(COUNT(mk_form_data.id)) OVER (
//               PARTITION BY mk_form_data.players_1st, mk_form_data.suid
//               ORDER BY mk_form_data.id
//           ) AS running_total_all,

//           -- Running total for game type 2
//           SUM(CASE WHEN mk_form_data.players = '2' THEN 1 ELSE 0 END) OVER (
//               PARTITION BY mk_form_data.players_1st, mk_form_data.suid, mk_form_data.players
//               ORDER BY mk_form_data.id
//           ) AS running_total_2,

//           -- Running total for game type 3
//           SUM(CASE WHEN mk_form_data.players = '3' THEN 1 ELSE 0 END) OVER (
//               PARTITION BY mk_form_data.players_1st, mk_form_data.suid, mk_form_data.players
//               ORDER BY mk_form_data.id
//           ) AS running_total_3,

//           -- Running total for game type 4
//           SUM(CASE WHEN mk_form_data.players = '4' THEN 1 ELSE 0 END) OVER (
//               PARTITION BY mk_form_data.players_1st, mk_form_data.suid, mk_form_data.players
//               ORDER BY mk_form_data.id
//           ) AS running_total_4
//       FROM
//           mk_form_data
//       WHERE
//           mk_form_data.players IN ('2', '3', '4')  -- For game types 2, 3, and 4
//       GROUP BY
//           mk_form_data.players_1st,
//           mk_form_data.suid,
//           mk_form_data.id
//       ORDER BY
//           mk_form_data.id DESC;
//     `;

//     return first_place.rows;
//   } catch (error) {
//     console.error("Database Error:", error);
//     throw new Error("Failed to fetch user.");
//   }
// }

// export async function fetchSessionPlacements(
//   suid: number
// ): Promise<TSessionPlacements[]> {
//   try {
//     const first_place = await sql<TSessionPlacements>`
//       SELECT
//         MAX(mk_form_data.suid) AS suid
//         ,mk_form_data.players_1st
//         ,COUNT(mk_form_data.id) AS first_place_count
//       FROM mk_form_data
//         WHERE mk_form_data.suid = ${suid}
//         GROUP BY mk_form_data.players_1st
//     `;

//     return first_place.rows;
//   } catch (error) {
//     console.error("Database Error:", error);
//     throw new Error("Failed to fetch user.");
//   }
// }

// --------------------------------------------------------
// Characters
// --------------------------------------------------------
export async function fetchCharacters() {
  try {
    const characters = await sql<TCharactersTable>`
      SELECT
        mk_characters.id
        ,mk_characters.character
        ,mk_characters.image_url_icon
        ,mk_characters.image_url_portrait_won
        ,mk_characters.image_url_portrait_lost
        ,mk_characters.type
      FROM mk_characters
    `;

    return characters.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch characters.");
  }
}

// --------------------------------------------------------
// Maps
// --------------------------------------------------------
export async function fetchMaps() {
  try {
    const maps = await sql<TMapsTable>`
      SELECT
        mk_maps.id
        ,mk_maps.map
        ,mk_maps.image_url
      FROM mk_maps
    `;

    return maps.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch maps.");
  }
}
