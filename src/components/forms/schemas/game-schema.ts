import {
  characterNames,
  tempPlayerNames,
  tempPlayerNamesEnum,
  tempPlayerNamesSelectOption,
} from "@/types/options";
import { z } from "zod";

export const GameSchema = z.object({
  id: z.number(),
  timestamp: z.date(),
  new_session: z.string(),
  suid: z.number(),
  map: z.string(),
  players: z.number(),
  players_1st: z
    .string()
    .nullable()
    .refine(
      (val) => {
        if (val) {
          !tempPlayerNames.includes(val);
        }
      },
      { message: "Player name must be a valid select option" }
    ),
  players_2nd: z
    .string()
    .nullable()
    .refine(
      (val) => {
        if (val) {
          !tempPlayerNames.includes(val);
        }
      },
      { message: "Player name must be a valid select option" }
    ),
  players_3rd: z
    .string()
    .nullable()
    .refine(
      (val) => {
        if (val) {
          !tempPlayerNames.includes(val);
        }
      },
      { message: "Player name must be a valid select option" }
    ),
  players_4th: z
    .string()
    .nullable()
    .refine(
      (val) => {
        if (val) {
          !tempPlayerNames.includes(val);
        }
      },
      { message: "Player name must be a valid select option" }
    ),
  characters_1st: characterNames,
  characters_2nd: characterNames,
  characters_3rd: characterNames.nullable(),
  characters_4th: characterNames.nullable(),
  season: z.number(),
});

// --------------------------------------------------------
// Update
// --------------------------------------------------------
// Remove id from base schema
export const CreateGameSchema = GameSchema.omit({ id: true, timestamp: true });

export type TCreateGameSchema = z.infer<typeof CreateGameSchema>;

export const defaultValuesCreateGameSchema: TCreateGameSchema = {
  // timestamp: new Date(),
  // TODO: getCurrentSession fetch service
  // Handle First Game of session in Form with useState?
  new_session: "",
  // TODO: getCurrentSession fetch service
  suid: 0,
  map: "",
  players: 4,
  players_1st: "",
  players_2nd: "",
  players_3rd: "",
  players_4th: "",
  characters_1st: characterNames.options[0],
  characters_2nd: characterNames.options[1],
  characters_3rd: characterNames.options[2],
  characters_4th: characterNames.options[3],
  // TODO: getCurrentSeason fetch service
  season: 0,
};

export type TCreateGameState = {
  errors?: {
    new_session?: string[];
    suid?: string[];
    map?: string[];
    players?: string[];
    players_1st?: string[];
    players_2nd?: string[];
    players_3rd?: string[];
    players_4th?: string[];
    characters_1st?: string[];
    characters_2nd?: string[];
    characters_3rd?: string[];
    characters_4th?: string[];
    season?: string[];
  };
  message?: string | null;
};

// --------------------------------------------------------
// Update
// --------------------------------------------------------
export type TUpdateGameSchema = z.infer<typeof GameSchema>;

export const defaultValuesUpdateGameSchema: TUpdateGameSchema = {
  id: 0,
  timestamp: new Date(),
  // TODO: getCurrentSession fetch service
  // Handle First Game of session in Form with useState?
  new_session: "",
  // TODO: getCurrentSession fetch service
  suid: 0,
  map: "",
  players: 4,
  players_1st: "",
  players_2nd: "",
  players_3rd: "",
  players_4th: "",
  characters_1st: characterNames.options[0],
  characters_2nd: characterNames.options[1],
  characters_3rd: characterNames.options[2],
  characters_4th: characterNames.options[3],
  // TODO: getCurrentSeason fetch service
  season: 0,
};

export type TUpdateGameState = {
  errors?: Partial<TCreateGameSchema>;
  message?: string | null;
};
