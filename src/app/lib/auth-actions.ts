"use server";

import { sql } from "@vercel/postgres";
import { cookies } from "next/headers";
import { signIn } from "@/auth";
import AuthError from "next-auth";
import { z } from "zod";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

const config = {
  maxAge: 60 * 60 * 24 * 7, // 1 week
  path: "/",
  domain: process.env.HOST ?? "localhost",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

const schemaSignup = z
  .object({
    username: z.string().min(3).max(20, {
      message: "Username must be between 3 and 20 characters",
    }),
    password: z.string().min(8).max(100, {
      message: "Password must be between 8 and 100 characters",
    }),
    email: z.string().email({
      message: "Please enter a valid email address",
    }),
  })
  .superRefine(({ password }, checkPassComplexity) => {
    let countOfNumbers = 0;
    for (let i = 0; i < password.length; i++) {
      let ch = password.charAt(i);
      if (!isNaN(+ch)) countOfNumbers++;
    }
    if (countOfNumbers < 1) {
      checkPassComplexity.addIssue({
        code: "custom",
        message: "Password must contain at least one digit.",
      });
    }
  })
  .superRefine(({ password }, checkPassComplexity) => {
    const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
    let countOfUpperCase = 0;
    for (let i = 0; i < password.length; i++) {
      let ch = password.charAt(i);
      if (containsUppercase(ch)) countOfUpperCase++;
    }
    if (countOfUpperCase < 1) {
      checkPassComplexity.addIssue({
        code: "custom",
        message: "Password must contain at least one Upper Case character.",
      });
    }
  })
  .superRefine(({ password }, checkPassComplexity) => {
    const containsLowercase = (ch: string) => /[a-z]/.test(ch);
    let countOfLowerCase = 0;
    for (let i = 0; i < password.length; i++) {
      let ch = password.charAt(i);
      if (containsLowercase(ch)) countOfLowerCase++;
    }
    if (countOfLowerCase < 1) {
      checkPassComplexity.addIssue({
        code: "custom",
        message: "Password must contain at least one lower case character",
      });
    }
  })
  .superRefine(({ password }, checkPassComplexity) => {
    const containsSpecialChar = (ch: string) =>
      /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
    let countOfSpecialChar = 0;
    for (let i = 0; i < password.length; i++) {
      let ch = password.charAt(i);
      if (containsSpecialChar(ch)) countOfSpecialChar++;
    }
    if (countOfSpecialChar < 1) {
      checkPassComplexity.addIssue({
        code: "custom",
        message: "Password must contain at least one special character!",
      });
    }
  });
// TODO: User name already exists
// TODO: Email already exists

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
  const validatedFields = schemaSignup.safeParse({
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
