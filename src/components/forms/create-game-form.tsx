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
  characterNamesEnum,
  gameType,
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
import { fetchCharacters, fetchMaps } from "@/app/lib/data";

export default function CreateGameForm() {
  const form = useForm<TCreateGameSchema>({
    resolver: zodResolver(CreateGameSchema),
    defaultValues: defaultValuesCreateGameSchema,
  });

  const [charactersData, setCharactersData] = useState([
    { character: "", image_url_portrait_won: "", image_url_portrait_lost: "" },
  ]);
  const [mapsData, setMapsData] = useState([{ map: "", image_url: "" }]);

  const [openFirstPlace, setOpenFirstPlace] = useState(false);
  const [openSecondPlace, setOpenSecondPlace] = useState(false);
  const [openThirdPlace, setOpenThirdPlace] = useState(false);
  const [openFourthPlace, setOpenFourthPlace] = useState(false);

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
    // https://stackoverflow.com/a/67547285
    async function setData() {
      const charactersDataInitial = await fetchCharacters();
      const mapsDataInitial = await fetchMaps();

      setCharactersData(charactersDataInitial);
      setMapsData(mapsDataInitial);
    }

    setData();
  }, [setCharactersData, setMapsData]);

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

  const onSubmit = async (values: TCreateGameSchema) => {
    // https://brockherion.dev/blog/posts/using-react-hook-form-with-nextjs-13-server-actions/
    await createGame(formActionState, values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((values) => onSubmit(values))}>
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          <div className="mb-4">
            <div className="flex flex-col md:flex-row items-start mb-4">
              <div className="flex flex-col mb-2 md:mr-2">
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
                          <SelectTrigger className="w-[200px] h-[45px] justify-between bg-white">
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
              </div>
              <div className="flex flex-col items-center mb-2">
                <FormField
                  control={form.control}
                  name="map"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Map</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="flex w-[240px] h-[45px] justify-between bg-white">
                            <SelectValue placeholder="Select Map..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="relative flex items-center w-[240px] justify-between">
                          {mapNamesAlphabeticalEnum.options.map((item) => (
                            <SelectItem
                              key={item}
                              value={item}
                              className="relative flex items-center  justify-between"
                            >
                              <div className="flex flex-row items-center">
                                {mapsData[0].map !== "" && (
                                  <Image
                                    src={
                                      mapsData
                                        .filter((m) => m.map === item)
                                        .map((e) => e.image_url)[0]
                                    }
                                    className="rounded-sm mr-1"
                                    width={50}
                                    height={50}
                                    alt={`${item} picture`}
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
              </div>
            </div>
            <div className="flex flex-col bg-gray-200 rounded-md mb-4 md:mb-6 p-2">
              <h2 className="mb-2">First Place</h2>
              <FormField
                control={form.control}
                name="players_1st"
                render={({ field }) => (
                  <FormItem className="flex flex-col mb-1">
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
                    {/* <FormDescription>Who got first?</FormDescription> */}
                    <FormMessage className="text-red-500 text-xs italic mt-1 py-2" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="characters_1st"
                render={({ field }) => (
                  <FormItem className="flex flex-col mb-1">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[200px] h-[45px] justify-between bg-white">
                          <SelectValue placeholder="Select Character..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="relative flex items-center w-[200px] justify-between">
                        {characterNamesEnum.options.map((item) => (
                          <SelectItem
                            key={item}
                            value={item}
                            className="relative flex items-center w-[200px] justify-between"
                          >
                            <div className="flex flex-row items-center">
                              {charactersData[0].character !== "" && (
                                <Image
                                  src={
                                    charactersData
                                      .filter((c) => c.character === item)
                                      .map((e) => e.image_url_portrait_won)[0]
                                  }
                                  className="rounded-full mr-1"
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
            </div>
            <div className="flex flex-col bg-gray-200 rounded-md mb-4 md:mb-6 p-2">
              <h2 className="mb-2">Second Place</h2>
              <FormField
                control={form.control}
                name="players_2nd"
                render={({ field }) => (
                  <FormItem className="flex flex-col mb-1">
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
                    <FormMessage className="text-red-500 text-xs italic mt-1 py-2" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="characters_2nd"
                render={({ field }) => (
                  <FormItem className="flex flex-col mb-1">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[200px] h-[45px] justify-between bg-white">
                          <SelectValue placeholder="Select Character..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="relative flex items-center w-[200px] justify-between">
                        {characterNamesEnum.options.map((item) => (
                          <SelectItem
                            key={item}
                            value={item}
                            className="relative flex items-center w-[200px] justify-between"
                          >
                            <div className="flex flex-row items-center">
                              {charactersData[0].character !== "" && (
                                <Image
                                  src={
                                    charactersData
                                      .filter((c) => c.character === item)
                                      .map((e) => e.image_url_portrait_lost)[0]
                                  }
                                  className="rounded-full mr-1"
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
            </div>

            {watchPlayers !== "2" && (
              <div className="flex flex-col bg-gray-200 rounded-md mb-4 md:mb-6 p-2">
                <h2 className="mb-2">Third Place</h2>
                <FormField
                  control={form.control}
                  name="players_3rd"
                  render={({ field }) => (
                    <FormItem className="flex flex-col mb-1">
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
                      <FormMessage className="text-red-500 text-xs italic mt-1 py-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="characters_3rd"
                  render={({ field }) => (
                    <FormItem className="flex flex-col mb-1">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-[200px] h-[45px] justify-between bg-white">
                            <SelectValue placeholder="Select Character..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="relative flex items-center w-[200px] justify-between">
                          {characterNamesEnum.options.map((item) => (
                            <SelectItem
                              key={item}
                              value={item}
                              className="relative flex items-center w-[200px] justify-between"
                            >
                              <div className="flex flex-row items-center">
                                {charactersData[0].character !== "" && (
                                  <Image
                                    src={
                                      charactersData
                                        .filter((c) => c.character === item)
                                        .map(
                                          (e) => e.image_url_portrait_lost
                                        )[0]
                                    }
                                    className="rounded-full mr-1"
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
              </div>
            )}
            {watchPlayers !== "2" && watchPlayers !== "3" && (
              <div className="flex flex-col bg-gray-200 rounded-md mb-4 md:mb-6 p-2">
                <h2 className="mb-2">Fourth Place</h2>
                <FormField
                  control={form.control}
                  name="players_4th"
                  render={({ field }) => (
                    <FormItem className="flex flex-col mb-1">
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
                      <FormMessage className="text-red-500 text-xs italic mt-1 py-2" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="characters_4th"
                  render={({ field }) => (
                    <FormItem className="flex flex-col mb-1">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-[200px] h-[45px] justify-between bg-white">
                            <SelectValue placeholder="Select Character..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="relative flex items-center w-[200px] justify-between">
                          {characterNamesEnum.options.map((item) => (
                            <SelectItem
                              key={item}
                              value={item}
                              className="relative flex items-center w-[200px] justify-between"
                            >
                              <div className="flex flex-row items-center">
                                {charactersData[0].character !== "" && (
                                  <Image
                                    src={
                                      charactersData
                                        .filter((c) => c.character === item)
                                        .map(
                                          (e) => e.image_url_portrait_lost
                                        )[0]
                                    }
                                    className="rounded-full mr-1"
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
              </div>
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
