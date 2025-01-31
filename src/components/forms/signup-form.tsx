"use client";

import { lusitana } from "@/components/ui/fonts";
import {
  AtSymbolIcon,
  KeyIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/c-button";
import { useActionState } from "react";
import { signupUserAction, SignupUserState } from "@/app/lib/auth-actions";
import Link from "next/link";
import { TSignupSchema } from "./schemas/signup-form-schema";
import { useFormContext } from "react-hook-form";
import { ZodErrorMessage } from "../custom/zod-error-message";

export default function SignupForm() {
  const {
    register,
    formState: { errors, isSubmitting, isValid },
  } = useFormContext<TSignupSchema>();

  const initialState: SignupUserState = { message: null, errors: {} };

  const [formState, formAction] = useActionState(
    signupUserAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Please sign up to continue.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="username"
            >
              Username
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                {...register("username")}
                id="username"
                type="username"
                name="username"
                placeholder="Enter your username"
                aria-describedby="username-error"
                required
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <ZodErrorMessage
              id="username-error"
              error={errors["username"]?.message}
            />
          </div>
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                {...register("email")}
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                aria-describedby="email-error"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <ZodErrorMessage
              id="email-error"
              error={errors["email"]?.message}
            />
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                {...register("password")}
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                aria-describedby="password-error"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <ZodErrorMessage
              id="password-error"
              error={errors["password"]?.message}
            />
          </div>
        </div>
        <Button
          className="mt-4 w-full"
          aria-disabled={!isValid || isSubmitting}
          disabled={!isValid || isSubmitting}
          type="submit"
          name="action"
          value="credentials"
        >
          Sign Up{" "}
          <ClipboardDocumentListIcon className="ml-auto h-7 w-7 text-gray-50" />
        </Button>
        <div className="mt-4 text-center text-sm">
          Have an account?
          <Link className="underline ml-2" href="login">
            Log In
          </Link>
        </div>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {formState?.message && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{formState?.message}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
