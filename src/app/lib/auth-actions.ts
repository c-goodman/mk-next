"use server";

import AuthError from "next-auth";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { SignupSchema } from "@/components/forms/schemas/signup-form-schema";
import { sql } from "@vercel/postgres";

// For use with JWT?
// https://github.com/PaulBratslavsky/epic-next-15-strapi-5/blob/main/frontend/src/data/actions/auth-actions.ts
// import { cookies } from "next/headers";
// const config = {
//   maxAge: 60 * 60 * 24 * 7, // 1 week
//   path: "/",
//   domain: process.env.HOST ?? "localhost",
//   httpOnly: true,
//   secure: process.env.NODE_ENV === "production",
// };

export type SignupUserState = {
  errors?: {
    username?: string[];
    password?: string[];
    email?: string[];
  };
  message?: string | null;
};

export async function signupUserAction(
  prevState: SignupUserState,
  formData: FormData
) {
  const validatedFields = SignupSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Sign Up.",
    };
  } else {
    // Prepare data for insertion into the database
    const { username, password, email } = validatedFields.data;

    // Salt and hash the password before inserting
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // Insert data into db
      await sql`
          INSERT INTO users (name, email, password)
          VALUES (${username}, ${email}, ${hashedPassword})
          `;
      redirect("/login");
    } catch (error) {
      console.log("Database Error", error);
      return {
        ...prevState,
        errors: {},
        message: "Database Error: Failed to Sign Up.",
      };
    }
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      // switch (error.type)
      switch (error) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function authenticateGoogle(
  prevState: string | undefined,
  formData: FormData
) {
  // const action = formData.get("action");
  // // https://www.youtube.com/watch?v=O8Ae6MC5bf4&ab_channel=tapaScriptbyTapasAdhikary
  // if (typeof action === "string") {
  //   await signIn(action, { redirectTo: "/dashboard" });
  // }
  // console.log(action);

  try {
    await signIn("google", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      // switch (error.type)
      switch (error) {
        case "GoogleSignin":
          return "Oopsie Whoopsie.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
