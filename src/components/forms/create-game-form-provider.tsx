"use client";

import CreateGameForm from "./create-game-form";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  defaultValuesCreateGameSchema,
  TCreateGameSchema,
  CreateGameSchema,
} from "./schemas/game-schema";

export function CreateGameFormProvider() {
  const methods = useForm<TCreateGameSchema>({
    resolver: zodResolver(CreateGameSchema),
    mode: "onBlur",
    defaultValues: defaultValuesCreateGameSchema,
  });

  return (
    <FormProvider {...methods}>
      <CreateGameForm />
    </FormProvider>
  );
}
