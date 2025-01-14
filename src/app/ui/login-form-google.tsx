"use client";

import {
  CheckBadgeIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import { Button } from "@/app/ui/button";
import { useActionState } from "react";
import { authenticateGoogle } from "@/app/lib/actions";

export default function LoginFormGoogle() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticateGoogle,
    undefined
  );

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <div className="w-full">
          <Button
            className="mt-4 w-full"
            aria-disabled={isPending}
            type="submit"
            name="action"
            value="google"
          >
            Log in with Google{" "}
            <CheckBadgeIcon className="ml-auto h-7 w-7 text-gray-50" />
          </Button>
          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {errorMessage && (
              <>
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-500">{errorMessage}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
