"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CButton } from "@/components/ui/custom/c-button";
import { CCombobox } from "../ui/custom/c-combobox";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { createGame, TCreateGameState } from "@/app/lib/actions";
import { defaultValuesCreateGameSchema } from "./schemas/game-schema";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useActionState, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { ZodErrorMessage } from "../custom/zod-error-message";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import {
  CreateGameSchema,
  TCreateGameSchema,
} from "@/components/forms/schemas/game-schema";
import {
  gameTypeSelectOptions,
  playerNamesComboboxOptions,
  tempPlayerNames,
  tempPlayerNamesSelectOption,
} from "@/types/options";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";

export default function CreateGameForm() {
  const form = useForm<TCreateGameSchema>({
    resolver: zodResolver(CreateGameSchema),
    defaultValues: defaultValuesCreateGameSchema,
  });

  const [openFirstPlace, setOpenFirstPlace] = useState(false);
  const [openSecondPlace, setOpenSecondPlace] = useState(false);
  const [openThirdPlace, setOpenThirdPlace] = useState(false);
  const [openFourthPlace, setOpenFourthPlace] = useState(false);
  //   const [value, setValue] = useState("");

  //   const initialState: TCreateGameState = { message: null, errors: {} };

  //   const [formState, formAction] = useActionState(createGame, initialState);

  const watchPlayers = form.watch("players");
  const watchFirstPlace = form.watch("players_1st");

  console.log(watchPlayers);
  console.log(watchFirstPlace);

  function onSubmit(values: TCreateGameSchema) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        // action={formAction}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          <div className="mb-4">
            <FormField
              control={form.control}
              name="players"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Players</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormDescription>How many players?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="players_1st"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>1st Place </FormLabel>
                  <Popover
                    open={openFirstPlace}
                    onOpenChange={setOpenFirstPlace}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openFirstPlace}
                          className="w-[200px] justify-between"
                        >
                          {field.value
                            ? playerNamesComboboxOptions.find(
                                (item) => item.value === field.value
                              )?.label
                            : "Select item..."}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search item..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No Player Found.</CommandEmpty>
                          <CommandGroup>
                            {playerNamesComboboxOptions.map((item) => (
                              <CommandItem
                                key={item.value}
                                value={item.value}
                                onSelect={() => {
                                  form.setValue("players_1st", item.value);
                                  setOpenFirstPlace(false);
                                }}
                              >
                                {item.label}
                                <Check
                                  key={item.value}
                                  className={cn(
                                    "ml-auto",
                                    item.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>Who got first?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ZodErrorMessage
              id="players_1st-error"
              error={form.formState.errors["players_1st"]?.message}
            />
            <FormField
              control={form.control}
              name="players_2nd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>2nd Place </FormLabel>
                  <Popover
                    open={openSecondPlace}
                    onOpenChange={setOpenSecondPlace}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openSecondPlace}
                          className="w-[200px] justify-between"
                        >
                          {field.value
                            ? playerNamesComboboxOptions.find(
                                (item) => item.value === field.value
                              )?.label
                            : "Select item..."}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search item..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No Player Found.</CommandEmpty>
                          <CommandGroup>
                            {playerNamesComboboxOptions.map((item) => (
                              <CommandItem
                                key={item.value}
                                value={item.value}
                                onSelect={() => {
                                  form.setValue("players_2nd", item.value);
                                  setOpenSecondPlace(false);
                                }}
                              >
                                {item.label}
                                <Check
                                  key={item.value}
                                  className={cn(
                                    "ml-auto",
                                    item.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>Who got second?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="players_3rd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>3rd Place </FormLabel>
                  <Popover
                    open={openThirdPlace}
                    onOpenChange={setOpenThirdPlace}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openThirdPlace}
                          className="w-[200px] justify-between"
                        >
                          {field.value
                            ? playerNamesComboboxOptions.find(
                                (item) => item.value === field.value
                              )?.label
                            : "Select item..."}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search item..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No Player Found.</CommandEmpty>
                          <CommandGroup>
                            {playerNamesComboboxOptions.map((item) => (
                              <CommandItem
                                key={item.value}
                                value={item.value}
                                onSelect={() => {
                                  form.setValue("players_3rd", item.value);
                                  setOpenThirdPlace(false);
                                }}
                              >
                                {item.label}
                                <Check
                                  key={item.value}
                                  className={cn(
                                    "ml-auto",
                                    item.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>Who got third?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="players_4th"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>4th Place </FormLabel>
                  <Popover
                    open={openFourthPlace}
                    onOpenChange={setOpenFourthPlace}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openFourthPlace}
                          className="w-[200px] justify-between"
                        >
                          {field.value
                            ? playerNamesComboboxOptions.find(
                                (item) => item.value === field.value
                              )?.label
                            : "Select item..."}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search item..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No Player Found.</CommandEmpty>
                          <CommandGroup>
                            {playerNamesComboboxOptions.map((item) => (
                              <CommandItem
                                key={item.value}
                                value={item.value}
                                onSelect={() => {
                                  form.setValue("players_4th", item.value);
                                  setOpenFourthPlace(false);
                                }}
                              >
                                {item.label}
                                <Check
                                  key={item.value}
                                  className={cn(
                                    "ml-auto",
                                    item.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>Who got last? {`:(`}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <Link
              href="/dashboard/games"
              className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
            >
              Cancel
            </Link>
            <CButton
              className="bg-green-500"
            //   aria-disabled={
            //     !form.formState.isValid || form.formState.isSubmitting
            //   }
            //   disabled={!form.formState.isValid || form.formState.isSubmitting}
              type="submit"
              name="action"
              value="game"
            >
              Create Game
            </CButton>
          </div>
          {/* <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {form.formState?.message && (
              <>
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-500">{formState?.message}</p>
              </>
            )}
          </div> */}
        </div>
      </form>
    </Form>
  );
}
