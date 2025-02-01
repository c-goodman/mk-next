"use client";

import Link from "next/link";
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { CButton } from "@/components/ui/custom/c-button";
import { Button } from "@/components/ui/button";
import { useActionState, useState } from "react";
import { useFormContext } from "react-hook-form";
import { TCreateGameSchema } from "@/components/forms/schemas/game-schema";
import { createGame, TCreateGameState } from "@/app/lib/actions";
import {
  gameTypeSelectOptions,
  tempPlayerNames,
  tempPlayerNamesSelectOption,
} from "@/types/options";
import { ZodErrorMessage } from "../custom/zod-error-message";
import { CCombobox } from "../ui/custom/c-combobox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";

export default function CreateGameForm() {
  const {
    register,
    formState: { errors, isSubmitting, isValid },
    trigger,
    watch,
  } = useFormContext<TCreateGameSchema>();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const initialState: TCreateGameState = { message: null, errors: {} };

  const [formState, formAction] = useActionState(createGame, initialState);

  const handleComboboxChange = async () => {
    await trigger("players_3rd"); // Trigger validation for the combobox field
  };

  const watchPlayers = watch("players");
  const watchFirstPlace = watch("players_1st");

  console.log(watchPlayers);
  console.log(watchFirstPlace);

  return (
    <form
      action={formAction}
      // onSubmit={onSubmit}
    >
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Customer Name */}
        <div className="mb-4">
          <div>
            <label htmlFor="players" className="mb-2 block text-sm font-medium">
              Game Type
            </label>
            <div className="relative">
              <select
                inputMode="text"
                {...register("players")}
                id="players"
                name="players"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                defaultValue=""
                aria-describedby="players-error"
                required
              >
                {/* <option value="" disabled>
                  Game Type
                </option> */}
                {gameTypeSelectOptions.map((i) => (
                  <option key={i.label} value={i.value}>
                    {i.value}
                  </option>
                ))}
              </select>
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <ZodErrorMessage
              id="players-error"
              error={errors["players"]?.message}
            />
          </div>
          <div>
            <label
              htmlFor="player_1st"
              className="mb-2 block text-sm font-medium"
            >
              1st
            </label>
            <div className="relative">
              <select
                inputMode="text"
                {...register("players_1st")}
                id="player_1st"
                name="player_1st"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="player_1st-error"
                required
              >
                {/* <option value="" disabled>
                  Select a player
                </option> */}
                {tempPlayerNamesSelectOption.map((i) => (
                  <option key={i.label} value={i.value}>
                    {i.value}
                  </option>
                ))}
              </select>
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <ZodErrorMessage
              id="player_1st-error"
              error={errors["players_1st"]?.message}
            />
          </div>
          <div>
            <label
              htmlFor="players_2nd"
              className="mb-2 block text-sm font-medium"
            >
              2nd
            </label>
            <div className="relative">
              <select
                {...register("players_2nd")}
                id="players_2nd"
                name="players_2nd"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="players_2nd-error"
                required
              >
                {/* <option value="" disabled>
                  Select a player
                </option> */}
                {tempPlayerNamesSelectOption.map((i) => (
                  <option key={i.label} value={i.value}>
                    {i.value}
                  </option>
                ))}
              </select>
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            <ZodErrorMessage
              id="players_2nd-error"
              error={errors["players_2nd"]?.message}
            />
          </div>
          {/* <label
            htmlFor="players_3rd"
            className="mb-2 block text-sm font-medium"
          >
            3rd
          </label> */}
          {/* <div className="relative">
            <CCombobox items={tempPlayerNamesSelectOption}></CCombobox>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between"
                >
                  {value
                    ? tempPlayerNamesSelectOption.find(
                        (item) => item.value === value
                      )?.label
                    : "Select item..."}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search item..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No item found.</CommandEmpty>
                    <CommandGroup>
                      {tempPlayerNamesSelectOption.map((item) => (
                        <CommandItem
                          {...(register("players_3rd"),
                          { required: "This field is required" })}
                          // name="players_3rd"
                          id={item.value}
                          key={item.value}
                          value={item.value}
                          aria-describedby="players_3rd-error"
                          onSelect={(currentValue) => {
                            setValue(
                              currentValue === value ? "" : currentValue
                            );
                            setOpen(false);
                          }}
                          onChange={handleComboboxChange}
                        >
                          {item.label}
                          <Check
                            id={item.value}
                            key={item.value}
                            className={cn(
                              "ml-auto",
                              value === item.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <ZodErrorMessage
            id="players_3rd-error"
            error={errors["players_3rd"]?.message}
          /> */}
        </div>
        <div>
          <label
            htmlFor="players_3rd"
            className="mb-2 block text-sm font-medium"
          >
            3rd
          </label>
          <div className="relative">
            <select
              {...register("players_3rd")}
              id="players_3rd"
              name="players_3rd"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="players_3rd-error"
            >
              {/* <option value="" disabled>
                Select a player
              </option> */}
              {tempPlayerNamesSelectOption.map((i) => (
                <option key={i.label} value={i.value}>
                  {i.value}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <ZodErrorMessage
            id="players_3rd-error"
            error={errors["players_3rd"]?.message}
          />
        </div>
        <div>
          <label
            htmlFor="players_4th"
            className="mb-2 block text-sm font-medium"
          >
            4th
          </label>
          <div className="relative">
            <select
              {...register("players_4th")}
              id="players_4th"
              name="players_4th"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="players_4th-error"
            >
              {/* <option value="" disabled>
                Select a player
              </option> */}
              {tempPlayerNamesSelectOption.map((i) => (
                <option key={i.label} value={i.value}>
                  {i.value}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <ZodErrorMessage
            id="players_4th-error"
            error={errors["players_4th"]?.message}
          />
        </div>
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
          // aria-disabled={!isValid || isSubmitting}
          // disabled={!isValid || isSubmitting}
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
        {formState?.message && (
          <>
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">{formState?.message}</p>
          </>
        )}
      </div>
    </form>
  );
}
