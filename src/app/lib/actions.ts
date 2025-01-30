"use server";

import {
  CreateGameSchema,
  TCreateGameState,
} from "@/components/forms/schemas/game-schema";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

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
  const validatedFields = CreateInvoice.safeParse({
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
  const validatedFields = UpdateInvoice.safeParse({
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
export async function createGame(
  prevState: TCreateGameState,
  formData: FormData
) {
  // Apply zod validation to formData
  const validatedFields = CreateGameSchema.safeParse({
    timestamp: new Date(),
    new_session: "NO",
    suid: 0,
    map: formData.get("map"),
    players: formData.get("players"),
    players_1st: formData.get("players_1st"),
    players_2nd: formData.get("players_2nd"),
    players_3rd: formData.get("players_3rd"),
    players_4th: formData.get("players_4th"),
    characters_1st: formData.get("characters_1st"),
    characters_2nd: formData.get("characters_2nd"),
    characters_3rd: formData.get("characters_3rd"),
    characters_4th: formData.get("characters_4th"),
    season: 0,
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }

  // Prepare data for insertion into the database
  const {
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
  } = validatedFields.data;

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
              ${new Date().toISOString()},
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
      message: "Database Error: Failed to Create Game.",
    };
  }

  // Invalidate the cache
  revalidatePath("/dashboard/games");
  // Only reachable if there are no errors
  // Send user back to origin onSubmit
  redirect("/dashboard/games");
}
