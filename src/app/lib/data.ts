import { sql } from "@vercel/postgres";
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
  TCharactersTable,
  TGamesTable,
  TUserNames,
  TUsersTable,
} from "./definitions";
import { formatCurrency } from "./utils";
import { ITEMS_PER_PAGE } from "@/types/constants";
import { GAMES_PER_SEASON } from "../../types/constants";

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

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? "0");
    const numberOfCustomers = Number(data[1].rows[0].count ?? "0");
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? "0");
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? "0");

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch card data.");
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

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch customer table.");
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

    // const invoiceStatusPromise = sql`SELECT
    //      SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
    //      SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
    //      FROM mk_form_data`;

    const data = await Promise.all([
      totalGamesCountPromise,
      totalUsersCountPromise,
      currentSeasonGamesPromise,
      // customerCountPromise,
      // invoiceStatusPromise,
    ]);

    const totalNumberOfGames = Number(data[0].rows[0].count ?? "0");
    const totalNumberOfUsers = Number(data[1].rows[0].count ?? "0");
    const currentSeasonNumberOfGames = Number(data[2].rows[0].count ?? "0");
    const currentSeason = Number(data[2].rows[0].season ?? "0");
    const currentSeasonNumberOfGamesRemaining =
      GAMES_PER_SEASON - currentSeasonNumberOfGames;
    // const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? "0");
    // const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? "0");

    return {
      totalNumberOfGames,
      totalNumberOfUsers,
      currentSeasonNumberOfGames,
      currentSeason,
      currentSeasonNumberOfGamesRemaining,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch card data.");
  }
}

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
