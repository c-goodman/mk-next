import { z } from "zod";
import {
  characterNames,
  gameType,
  mapNamesAlphabetical,
  tempPlayerNames,
  tempPlayerNamesEnum,
} from "@/types/options";

export const GameSchema = z.object({
  id: z.number(),
  timestamp: z.date(),
  new_session: z.string(),
  suid: z.number(),
  map: mapNamesAlphabetical,
  players: gameType,
  players_1st: tempPlayerNamesEnum.or(z.literal("")),
  players_2nd: tempPlayerNamesEnum.or(z.literal("")),
  players_3rd: tempPlayerNamesEnum.or(z.literal("")),
  players_4th: tempPlayerNamesEnum.or(z.literal("")),
  // players_1st: z
  //   .string()
  //   .nullable()
  //   .refine(
  //     (val) => {
  //       if (val) {
  //         tempPlayerNames.includes(val);
  //       }
  //     },
  //     { message: "Player name must be a valid select option" }
  //   ),
  // players_2nd: z
  //   .string()
  //   .nullable()
  //   .refine(
  //     (val) => {
  //       if (val) {
  //         tempPlayerNames.includes(val);
  //       }
  //     },
  //     { message: "Player name must be a valid select option" }
  //   ),
  // players_3rd: z
  //   .string()
  //   .nullable()
  //   .refine(
  //     (val) => {
  //       if (val) {
  //         !tempPlayerNames.includes(val);
  //       }
  //     },
  //     { message: "Player name must be a valid select option" }
  //   ),
  // players_4th: z
  //   .string()
  //   .nullable()
  //   .refine(
  //     (val) => {
  //       if (val) {
  //         !tempPlayerNames.includes(val);
  //       }
  //     },
  //     { message: "Player name must be a valid select option" }
  //   ),
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
export const CreateGameSchema = GameSchema.omit({
  id: true,
  timestamp: true,
})
  .superRefine((data, ctx) => {
    // 4 Player Games
    const playersArray = [
      data.players_1st,
      data.players_2nd,
      data.players_3rd,
      data.players_4th,
    ];
    const playersSet = new Set(playersArray);

    if (
      data.players === gameType.options[0] &&
      playersArray.length !== playersSet.size
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["players_1st", "players_2nd", "players_3rd", "players_4th"],
        message: "All Players must be unique",
      });
    }

    if (playersArray.some((value) => typeof value !== "string")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["players_1st", "players_2nd", "players_3rd", "players_4th"],
        message: "All Players must be string",
      });
    }

    if (playersArray.some((value) => value === "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["players_1st", "players_2nd", "players_3rd", "players_4th"],
        message: "All Players must have a value",
      });
    }
  })
  .superRefine((data, ctx) => {
    // 3 Player Games
    const playersArray = [data.players_1st, data.players_2nd, data.players_3rd];
    const playersSet = new Set(playersArray);

    if (
      data.players === gameType.options[1] &&
      playersArray.length !== playersSet.size
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["players_1st", "players_2nd", "players_3rd"],
        message: "All Players must be unique",
      });
    }
  })
  .superRefine((data, ctx) => {
    // 2 Player Games
    const playersArray = [data.players_1st, data.players_2nd];
    const playersSet = new Set(playersArray);

    if (
      data.players === gameType.options[2] &&
      playersArray.length !== playersSet.size
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["players_1st", "players_2nd"],
        message: "All Players must be unique",
      });
    }
  });

export type TCreateGameSchema = z.infer<typeof CreateGameSchema>;

export const defaultValuesCreateGameSchema: TCreateGameSchema = {
  // timestamp: new Date(),
  // TODO: getCurrentSession fetch service
  // Handle First Game of session in Form with useState?
  new_session: "",
  // TODO: getCurrentSession fetch service
  suid: 0,
  map: mapNamesAlphabetical.options[0],
  players: gameType.options[0],
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
  map: mapNamesAlphabetical.options[0],
  players: gameType.options[0],
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
