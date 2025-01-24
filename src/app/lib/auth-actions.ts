"use server";

import { signIn } from "@/auth";
import AuthError from "next-auth";

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
