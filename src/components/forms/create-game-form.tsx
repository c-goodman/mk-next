"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CButton } from "@/components/ui/custom/c-button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { createGame, TCreateGameState } from "@/app/lib/actions";
import { defaultValuesCreateGameSchema } from "./schemas/game-schema";
import {
  characterNamesComboboxOptions,
  characterNamesEnum,
  gameType,
  mapNamesAlphabeticalComboboxOptions,
  mapNamesAlphabeticalEnum,
  playerNamesComboboxOptions,
} from "@/types/options";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  CreateGameSchema,
  TCreateGameSchema,
} from "@/components/forms/schemas/game-schema";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { useFetchCharacters } from "@/app/lib/hooks/fetch-hooks";

const charactersData = await useFetchCharacters();

export default function CreateGameForm() {
  const form = useForm<TCreateGameSchema>({
    resolver: zodResolver(CreateGameSchema),
    defaultValues: defaultValuesCreateGameSchema,
  });

  // const [charactersData, setCharactersData] = useState(null);
  // const [isLoading, setLoading] = useState(true)

  const [openMap, setOpenMap] = useState(false);
  const [openFirstPlace, setOpenFirstPlace] = useState(false);
  const [openSecondPlace, setOpenSecondPlace] = useState(false);
  const [openThirdPlace, setOpenThirdPlace] = useState(false);
  const [openFourthPlace, setOpenFourthPlace] = useState(false);

  const [openFirstPlaceCharacter, setOpenFirstPlaceCharacter] = useState(false);
  const [openSecondPlaceCharacter, setOpenSecondPlaceCharacter] =
    useState(false);
  const [openThirdPlaceCharacter, setOpenThirdPlaceCharacter] = useState(false);
  const [openFourthPlaceCharacter, setOpenFourthPlaceCharacter] =
    useState(false);

  const initialState: TCreateGameState = { message: null, errors: {} };

  const [formActionState, formAction] = useActionState(
    createGame,
    initialState
  );

  const watchPlayers = form.watch("players");

  // useEffect(() => {
  //   // https://nextjs.org/docs/pages/building-your-application/data-fetching/client-side
  //   useFetchCharacters()
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setCharactersData(data);
  //       // setLoading(false);
  //     });
  // }, [setCharactersData]);

  useEffect(() => {
    if (watchPlayers === "2") {
      // 2 Player Game -> Set 4th and 3rd Player items to nullish
      form.setValue("players_4th", "");
      form.setValue("characters_4th", "");
      form.setValue("players_3rd", "");
      form.setValue("characters_3rd", "");
    }

    if (watchPlayers === "3") {
      // 3 Player Game -> Set 4th Player items to nullish
      form.setValue("players_4th", "");
      form.setValue("characters_4th", "");
    }
  }, [form, watchPlayers]);

  function onSubmit(values: TCreateGameSchema) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values);
  }

  return (
    <Form {...form}>
      <form action={formAction} onSubmit={form.handleSubmit(onSubmit)}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          <div className="mb-4">
            <FormField
              control={form.control}
              name="players"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Players</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="How many players?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {gameType.options.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500 text-xs italic mt-1 py-2" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="map"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Map </FormLabel>
                  <Popover open={openMap} onOpenChange={setOpenMap}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openMap}
                          className="w-[200px] justify-between"
                        >
                          {field.value
                            ? mapNamesAlphabeticalComboboxOptions.find(
                                (item) => item.value === field.value
                              )?.label
                            : "Select Map..."}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search Map..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No Map Found.</CommandEmpty>
                          <CommandGroup>
                            {mapNamesAlphabeticalComboboxOptions.map((item) => (
                              <CommandItem
                                key={item.value}
                                value={item.value}
                                onSelect={() => {
                                  form.setValue("map", item.value);
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
                  <FormDescription>What map?</FormDescription>
                  <FormMessage className="text-red-500 text-xs italic mt-1 py-2" />
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
                            : "Select Player..."}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search Player..."
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
                  <FormMessage className="text-red-500 text-xs italic mt-1 py-2" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="characters_1st"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>1st Character </FormLabel>
                  <Popover
                    open={openFirstPlaceCharacter}
                    onOpenChange={setOpenFirstPlaceCharacter}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openFirstPlaceCharacter}
                          className="w-[200px] justify-between"
                        >
                          {field.value
                            ? characterNamesComboboxOptions.find(
                                (item) => item.value === field.value
                              )?.label
                            : "Select Character..."}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search Character..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No Character Found.</CommandEmpty>
                          <CommandGroup>
                            {characterNamesComboboxOptions.map((item) => (
                              <CommandItem
                                key={item.value}
                                value={item.value}
                                onSelect={() => {
                                  form.setValue("characters_1st", item.value);
                                  setOpenFirstPlace(false);
                                }}
                              >
                                {charactersData && (
                                  <Image
                                    src={
                                      charactersData
                                        .filter(
                                          (c) => c.character === item.label
                                        )
                                        .map((e) => e.image_url_portrait_won)[0]
                                    }
                                    className="rounded-full"
                                    width={40}
                                    height={40}
                                    alt={`First place character picture`}
                                  />
                                )}
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
                  <FormDescription>As which character?</FormDescription>
                  <FormMessage className="text-red-500 text-xs italic mt-1 py-2" />
                </FormItem>
              )}
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
                            : "Select Player..."}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search Player..."
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
                  <FormMessage className="text-red-500 text-xs italic mt-1 py-2" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="characters_2nd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>2nd Character</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="How many players?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {characterNamesEnum.options.map((item) => (
                        <SelectItem key={item} value={item}>
                          <div>
                            {charactersData && (
                              <Image
                                src={
                                  charactersData
                                    .filter((c) => c.character === item)
                                    .map((e) => e.image_url_portrait_won)[0]
                                }
                                className="rounded-full"
                                width={40}
                                height={40}
                                alt={`First place character picture`}
                              />
                            )}
                            {item}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500 text-xs italic mt-1 py-2" />
                </FormItem>
              )}
            />
            {watchPlayers !== "2" && (
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
                              : "Select Player..."}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search Player..."
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
                    <FormMessage className="text-red-500 text-xs italic mt-1 py-2" />
                  </FormItem>
                )}
              />
            )}
            {watchPlayers !== "2" && watchPlayers !== "3" && (
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
                              : "Select Player..."}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search Player..."
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
                    <FormMessage className="text-red-500 text-xs italic mt-1 py-2" />
                  </FormItem>
                )}
              />
            )}
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
              // aria-disabled={
              //   !form.formState.isValid || form.formState.isSubmitting
              // }
              // disabled={!form.formState.isValid || form.formState.isSubmitting}
              type="submit"
              name="action"
              value="game"
            >
              Create Game
            </CButton>
          </div>
          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {formActionState.message && (
              <>
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-500">
                  {formActionState.message}
                </p>
              </>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
}
