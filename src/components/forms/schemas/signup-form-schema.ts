import { fetchUserByName, fetchUserNames } from "@/app/lib/data";
import {
  useFetchUserByEmail,
  useFetchUserByName,
  useFetchUserNames,
} from "@/app/lib/hooks/fetch-hooks";
import { z } from "zod";

export const SignupSchema = z
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
  .superRefine((data, ctx) => {
    let countOfNumbers = 0;
    for (let i = 0; i < data.password.length; i++) {
      const ch = data.password.charAt(i);
      if (!isNaN(+ch)) countOfNumbers++;
    }
    if (countOfNumbers < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "Password must contain at least one digit.",
      });
    }
  })
  .superRefine((data, ctx) => {
    const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
    let countOfUpperCase = 0;
    for (let i = 0; i < data.password.length; i++) {
      const ch = data.password.charAt(i);
      if (containsUppercase(ch)) countOfUpperCase++;
    }
    if (countOfUpperCase < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "Password must contain at least one Upper Case character.",
      });
    }
  })
  .superRefine((data, ctx) => {
    const containsLowercase = (ch: string) => /[a-z]/.test(ch);
    let countOfLowerCase = 0;
    for (let i = 0; i < data.password.length; i++) {
      const ch = data.password.charAt(i);
      if (containsLowercase(ch)) countOfLowerCase++;
    }
    if (countOfLowerCase < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "Password must contain at least one lower case character",
      });
    }
  })
  .superRefine((data, ctx) => {
    const containsSpecialChar = (ch: string) =>
      /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
    let countOfSpecialChar = 0;
    for (let i = 0; i < data.password.length; i++) {
      const ch = data.password.charAt(i);
      if (containsSpecialChar(ch)) countOfSpecialChar++;
    }
    if (countOfSpecialChar < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "Password must contain at least one special character!",
      });
    }
  })
  .superRefine(async (data, ctx) => {
    // Query the Users table by the current username value
    const userData = await useFetchUserByName(data.username);

    // If any records are returned raise an error
    // users.name has a unique constraint in the database
    if (userData.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["username"],
        message: "Username already exists",
      });
    }
  })
  .superRefine(async (data, ctx) => {
    // Query the Users table by the current email value
    const userData = await useFetchUserByEmail(data.email);

    // If any records are returned raise an error
    // users.name has a unique constraint in the database
    if (userData.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["email"],
        message: "Email already exists",
      });
    }
  });

export type TSignupSchema = z.infer<typeof SignupSchema>;

export const defaultValuesSignupSchema: TSignupSchema = {
  username: "",
  email: "",
  password: "",
};
