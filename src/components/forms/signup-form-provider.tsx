"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  defaultValuesSignupSchema,
  SignupSchema,
  TSignupSchema,
} from "./schemas/signup-form-schema";
import SignupForm from "./signup-form";

export function SignupFormProvider() {
  const methods = useForm<TSignupSchema>({
    resolver: zodResolver(SignupSchema),
    mode: "onBlur",
    defaultValues: defaultValuesSignupSchema,
  });

  return (
    <FormProvider {...methods}>
      <SignupForm />
    </FormProvider>
  );
}
