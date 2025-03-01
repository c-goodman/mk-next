"use server";

import {
  CreateGameSchema,
  TCreateGameSchema,
} from "@/components/forms/schemas/game-schema";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  fetchMostRecentNewSession,
  fetchMostRecentSeasonGamesCount,
  fetchMostRecentSession,
} from "./data";
import { TGamesTable, TMostRecentSeasonGamesCount } from "./definitions";
import { GAMES_PER_SEASON } from "@/types/constants";

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

  interface SessionItems {
    new_session: string;
    suid: number;
  }

  // TODO: test that this actually works lol
  // Helper function to determine if a new Session UID should be created
  // function setSessionItems(
  //   currentGameTimestamp: Date,
  //   newSessionCutoffStartTimestamp: Date,
  //   newSessionCutoffEndTimestamp: Date,
  //   previousSession: TGamesTable[]
  // ): SessionItems {
  //   if (
  //     currentGameTimestamp >= newSessionCutoffStartTimestamp &&
  //     currentGameTimestamp < newSessionCutoffEndTimestamp
  //   ) {
  //     if (previousSession[0].timestamp <= newSessionCutoffStartTimestamp) {
  //       return { new_session: "YES", suid: previousSession[0].suid + 1 };
  //     } else {
  //       return { new_session: "NO", suid: previousSession[0].suid };
  //     }
  //   } else {
  //     return { new_session: "NO", suid: previousSession[0].suid };
  //   }
  // }

  function setSessionItems(
    currentGameTimestamp: Date,
    sessionIndexGameTimestamp: Date,
    newSessionCutoffStartTimestamp: Date,
    newSessionCutoffEndTimestamp: Date,
    previousSession: TGamesTable[]
  ): SessionItems {
    if (
      // The current date must be within the session window
      currentGameTimestamp >= newSessionCutoffStartTimestamp &&
      currentGameTimestamp < newSessionCutoffEndTimestamp
    ) {
      if (
        // previousSession[0].timestamp <= newSessionCutoffStartTimestamp &&

        // The previous game
        // previousSession[0].timestamp > sessionIndexGameTimestamp &&

        // If the first game of the most recent session takes place before the new session
        sessionIndexGameTimestamp < newSessionCutoffStartTimestamp
      ) {
        return { new_session: "YES", suid: previousSession[0].suid + 1 };
      } else {
        return { new_session: "NO", suid: previousSession[0].suid };
      }
    } else {
      if (sessionIndexGameTimestamp < newSessionCutoffStartTimestamp) {
        return { new_session: "YES", suid: previousSession[0].suid + 1 };
      }

      return { new_session: "NO", suid: previousSession[0].suid };
    }
  }

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

  // Get the most recent session and season game counts data
  const mostRecentSession = await fetchMostRecentSession();
  const mostRecentSessionTimestamp = mostRecentSession[0].timestamp;

  const mostRecentSeasonGameCounts = await fetchMostRecentSeasonGamesCount();

  // Get the most recent session's first game of the day/session time period
  const mostRecentNewSession = await fetchMostRecentNewSession();
  const mostRecentNewSessionTimestamp = mostRecentNewSession[0].timestamp;

  // Set the date to 7 AM UTC
  const newSessionCutoffStart = mostRecentNewSessionTimestamp;
  // newSessionCutoffStart.setUTCHours(12, 0, 0, 0);
  newSessionCutoffStart.setUTCHours(7, 0, 0, 0);

  // Set the end of the window to 24 hours later
  const newSessionCutoffEnd = new Date(
    // Add 24 hours in milliseconds
    newSessionCutoffStart.getTime() + 24 * 60 * 60 * 1000
  );

  // Set server controlled values
  const timestamp = new Date();

  const new_session = setSessionItems(
    timestamp,
    mostRecentNewSessionTimestamp,
    newSessionCutoffStart,
    newSessionCutoffEnd,
    mostRecentSession
  ).new_session;
  const suid = setSessionItems(
    timestamp,
    mostRecentNewSessionTimestamp,
    newSessionCutoffStart,
    newSessionCutoffEnd,
    mostRecentSession
  ).suid;

  const season = setSeasonId(mostRecentSeasonGameCounts);

  try {
    // Insert data into db
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
              season
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
              ${season}
            )
            `;
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
