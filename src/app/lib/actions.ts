"use server";

import { GAMES_PER_SEASON } from "@/types/constants";
// @ts-ignore
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sql } from "@vercel/postgres";
import { TGamesTable, TMostRecentSeasonGamesCount } from "./definitions";
import { z } from "zod";
import {
  CreateGameSchema,
  TCreateGameSchema,
} from "@/components/forms/schemas/game-schema";
import {
  fetchMostRecentSeasonGamesCount,
  fetchMostRecentSession,
} from "./data";

// --------------------------------------------------------
// Invoices
// --------------------------------------------------------

const FormSchema = z.object({
  id: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  customerId: z.string(),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status.",
  }),
  date: z.string(),
});

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

// Use Zod to update the expected types
const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(prevState: State, formData: FormData) {
  // Apply zod validation to formData
  const validatedFields = await CreateInvoice.safeParseAsync({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  // Convert to cents to avoid floating point errors
  const amountInCents = amount * 100;
  // Format the date as "YYYY-MM-DD" string
  const date = new Date().toISOString().split("T")[0];

  try {
    // Insert data into db
    await sql`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
            `;
  } catch (error) {
    console.log("Database Error", error);
    return {
      message: "Database Error: Failed to Create Invoice.",
    };
  }

  // Invalidate the cache
  revalidatePath("/dashboard/invoices");
  // Only reachable if there are no errors
  // Send user back to invoices onSubmit
  redirect("/dashboard/invoices");
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = await UpdateInvoice.safeParseAsync({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Invoice.",
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
            UPDATE invoices
            SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
            WHERE id = ${id}
          `;
  } catch (error) {
    console.log("Database Error", error);
    return { message: "Database Error: Failed to Update Invoice." };
  }

  revalidatePath("/dashboard/invoices");
  // Only reachable if there are no errors
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath("/dashboard/invoices");
  } catch (error) {
    console.log("Database Error", error);
    throw new Error("Database Error: Failed to Delete Invoice.");
  }
}

// --------------------------------------------------------
// Games
// --------------------------------------------------------
export type TCreateGameState = {
  errors?: {
    map?: string[];
    players?: string[];
    players_1st?: string[];
    players_2nd?: string[];
    players_3rd?: string[];
    players_4th?: string[];
    characters_1st?: string[];
    characters_2nd?: string[];
    characters_3rd?: string[];
    characters_4th?: string[];
  };
  message?: string | null;
};

export async function createGame(
  prevState: TCreateGameState,
  formData: TCreateGameSchema
) {
  // Apply zod validation to formData
  const validatedFields = await CreateGameSchema.safeParseAsync({
    map: formData.map,
    players: formData.players,
    players_1st: formData.players_1st,
    players_2nd: formData.players_2nd,
    players_3rd: formData.players_3rd,
    players_4th: formData.players_4th,
    characters_1st: formData.characters_1st,
    characters_2nd: formData.characters_2nd,
    characters_3rd: formData.characters_3rd,
    characters_4th: formData.characters_4th,
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (validatedFields.success === false) {
    console.log(JSON.stringify(validatedFields.data));
    return {
      ...prevState,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Game.",
    };
  }

  // Prepare data for insertion into the database
  const {
    map,
    players,
    players_1st,
    players_2nd,
    players_3rd,
    players_4th,
    characters_1st,
    characters_2nd,
    characters_3rd,
    characters_4th,
  } = validatedFields.data;

  // Get the most recent session records
  const mostRecentSession = await fetchMostRecentSession();
  // Get the previous session records
  // Basically mostRecentSession.suid - 1 in the sql query
  // const penultimateSession = await fetchPenultimateSession();

  type TCutoffWindow = { windowStart: Date; windowEnd: Date };

  function handleCutoffWindow(currentGameTimestamp: Date): TCutoffWindow {
    if (
      currentGameTimestamp.getHours() >= 7 &&
      currentGameTimestamp.getHours() <= 24
    ) {
      // Set the date to 7 AM UTC
      // Create a copy to avoid modifying the original
      const newSessionCutoffStart = new Date(currentGameTimestamp);
      newSessionCutoffStart.setUTCHours(12, 0, 0, 0);
      // newSessionCutoffStart.setUTCHours(7, 0, 0, 0);

      // Set the end of the window to 24 hours later
      const newSessionCutoffEnd = new Date(
        // Add 24 hours in milliseconds
        newSessionCutoffStart.getTime() + 24 * 60 * 60 * 1000
      );

      return {
        windowStart: newSessionCutoffStart,
        windowEnd: newSessionCutoffEnd,
      };

      // if (currentGameTimestamp.getHours() < 7)
    } else {
      // Create a copy to avoid modifying the original
      const previousDayTimestamp = new Date(currentGameTimestamp);
      // Subtract 1 day
      previousDayTimestamp.setDate(previousDayTimestamp.getDate() - 1);

      // Set the date to 7 AM UTC
      const newSessionCutoffStart = previousDayTimestamp;
      newSessionCutoffStart.setUTCHours(12, 0, 0, 0);
      // newSessionCutoffStart.setUTCHours(7, 0, 0, 0);

      // Set the end of the window to 24 hours later
      const newSessionCutoffEnd = new Date(
        // Add 24 hours in milliseconds
        newSessionCutoffStart.getTime() + 24 * 60 * 60 * 1000
      );

      return {
        windowStart: newSessionCutoffStart,
        windowEnd: newSessionCutoffEnd,
      };
    }
  }

  type SessionItems = {
    new_session: string;
    suid: number;
    suid_window_start: Date;
    suid_window_end: Date;
  };

  function setSessionItems(
    currentGameTimestamp: Date,
    mostRecentSession: TGamesTable[]
    // penultimateSession: TGamesTable[]
  ): SessionItems {
    // Since the records are sorted `ORDER BY mk_form_data.timestamp DESC` in the sql query
    // We can slice the following from the array
    // First game of the new session
    // Similar to `mostRecentSession.find((game) => game.new_session === "YES")` but do not..
    // ..have to worry about the return type being undefined
    // const mostRecentSessionFirstGame =
    //   mostRecentSession[mostRecentSession.length - 1];
    // Technically the Most Recent Game
    const mostRecentSessionLastGame = mostRecentSession[0];

    // Repeat for the previous session array
    // const penultimateSessionFirstGame =
    //   penultimateSession[penultimateSession.length - 1];
    // const penultimateSessionLastGame = penultimateSession[0];

    const { windowStart, windowEnd } = handleCutoffWindow(currentGameTimestamp);

    if (
      windowStart === mostRecentSessionLastGame.suid_window_start &&
      windowEnd === mostRecentSessionLastGame.suid_window_end
    ) {
      if (mostRecentSessionLastGame.new_session === "YES") {
        return {
          suid: mostRecentSessionLastGame.suid,
          new_session: "NO",
          suid_window_start: mostRecentSessionLastGame.suid_window_start,
          suid_window_end: mostRecentSessionLastGame.suid_window_end,
        };
        // Tautology?
      } else {
        return {
          suid: mostRecentSessionLastGame.suid,
          new_session: "NO",
          suid_window_start: mostRecentSessionLastGame.suid_window_start,
          suid_window_end: mostRecentSessionLastGame.suid_window_end,
        };
      }
    } else {
      if (
        currentGameTimestamp >= windowStart &&
        currentGameTimestamp < windowEnd
      ) {
        if (mostRecentSessionLastGame.timestamp < windowStart) {
          return {
            suid: mostRecentSessionLastGame.suid + 1,
            new_session: "YES",
            suid_window_start: windowStart,
            suid_window_end: windowEnd,
          };
        } else {
          return {
            suid: mostRecentSessionLastGame.suid,
            new_session: "NO",
            suid_window_start: windowStart,
            suid_window_end: windowEnd,
          };
        }
      } else {
        // Should not be reachable but needed for fully defined return type
        return {
          suid: mostRecentSessionLastGame.suid,
          new_session: "NO",
          suid_window_start: windowStart,
          suid_window_end: windowEnd,
        };
      }
    }
  }

  // // Get the current timestamp
  // const sessionItemsTimestamp = new Date();

  // Get the current game timestamp
  const timestamp = new Date();

  const { suid, new_session, suid_window_start, suid_window_end } =
    setSessionItems(
      timestamp,
      mostRecentSession
      // penultimateSession
    );

  // Helper function to determine if a new Season UID should be created
  function setSeasonId(
    mostRecentSeasonGameCountsData: TMostRecentSeasonGamesCount
  ): number {
    if (mostRecentSeasonGameCountsData.count + 1 > GAMES_PER_SEASON) {
      return mostRecentSeasonGameCountsData.season + 1;
    } else {
      return mostRecentSeasonGameCountsData.season;
    }
  }

  const mostRecentSeasonGameCounts = await fetchMostRecentSeasonGamesCount();

  const season = setSeasonId(mostRecentSeasonGameCounts);

  try {
    // Insert data into db
    // const result = await sql`
    await sql`
            INSERT INTO mk_form_data (
              timestamp,
              new_session,
              suid,
              map,
              players,
              players_1st,
              players_2nd,
              players_3rd,
              players_4th,
              characters_1st,
              characters_2nd,
              characters_3rd,
              characters_4th,
              season,
              suid_window_start,
              suid_window_end
            )
            VALUES (
              ${timestamp.toISOString()},
              ${new_session},
              ${suid},
              ${map},
              ${players},
              ${players_1st},
              ${players_2nd},
              ${players_3rd},
              ${players_4th},
              ${characters_1st},
              ${characters_2nd},
              ${characters_3rd},
              ${characters_4th},
              ${season},
              ${suid_window_start.toISOString()},
              ${suid_window_end.toISOString()}
            )
            RETURNING id;
            `;

    // TODO
    // Return the new gameId to be used to update the corresponding Skill data
    // const gameId = result.rows[0].id;
  } catch (error) {
    console.log("Database Error", error);
    return {
      ...prevState,
      errors: {},
      message: "Database Error: Failed to Create Game.",
    };
  }

  // Invalidate the cache
  revalidatePath("/dashboard/games");
  // Only reachable if there are no errors
  // Send user back to origin onSubmit
  redirect("/dashboard/games");
}
