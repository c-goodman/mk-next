import { z } from "zod";
import {
  characterNamesEnum,
  gameType,
  mapNamesAlphabeticalEnum,
  tempPlayerNamesEnum,
} from "@/types/options";

export const GameSchema = z.object({
  id: z.number(),
  timestamp: z.date(),
  new_session: z.string(),
  suid: z.number(),
  map: mapNamesAlphabeticalEnum,
  players: gameType,
  players_1st: tempPlayerNamesEnum.or(z.literal("")),
  players_2nd: tempPlayerNamesEnum.or(z.literal("")),
  players_3rd: tempPlayerNamesEnum.or(z.literal("")),
  players_4th: tempPlayerNamesEnum.or(z.literal("")),
  characters_1st: characterNamesEnum.or(z.literal("")),
  characters_2nd: characterNamesEnum.or(z.literal("")),
  characters_3rd: characterNamesEnum.or(z.literal("")),
  characters_4th: characterNamesEnum.or(z.literal("")),
  season: z.number(),
});

// --------------------------------------------------------
// Create
// --------------------------------------------------------
export const CreateGameSchema = z
  .object({
    map: mapNamesAlphabeticalEnum.or(z.literal("")),
    players: gameType.or(z.literal("")),
    players_1st: tempPlayerNamesEnum.or(z.literal("")),
    players_2nd: tempPlayerNamesEnum.or(z.literal("")),
    players_3rd: tempPlayerNamesEnum.or(z.literal("")),
    players_4th: tempPlayerNamesEnum.or(z.literal("")),
    characters_1st: characterNamesEnum.or(z.literal("")),
    characters_2nd: characterNamesEnum.or(z.literal("")),
    characters_3rd: characterNamesEnum.or(z.literal("")),
    characters_4th: characterNamesEnum.or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    // Game Type
    if (data.players === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["players"],
        message: "Game type must be specified",
      });
    }
  })
  .superRefine((data, ctx) => {
    // Map
    if (data.map === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["map"],
        message: "Map must be specified",
      });
    }

    if (data.map === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["map"],
        message: "Map must be specified",
      });
    }
  })
  .superRefine((data, ctx) => {
    // 4 Player Games
    // ---------------------------
    // Players
    // ---------------------------
    const playersArray = [
      data.players_1st,
      data.players_2nd,
      data.players_3rd,
      data.players_4th,
    ];

    const playersInputFields = [
      "players_1st",
      "players_2nd",
      "players_3rd",
      "players_4th",
    ];

    const playersSet = new Set(playersArray);

    playersInputFields.forEach((fieldName, _index) => {
      if (data.players === "4" && playersArray.length !== playersSet.size) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [fieldName],
          message: "No duplicates allowed",
        });
      }
    });

    playersInputFields.forEach((fieldName, _index) => {
      if (data.players === "4" && playersArray.some((value) => value === "")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [fieldName],
          message: "All Players must have a value",
        });
      }
    });

    // ---------------------------
    // Characters
    // ---------------------------
    const charactersArray = [
      data.players_1st,
      data.players_2nd,
      data.players_3rd,
      data.players_4th,
    ];

    const charactersInputFields = [
      "characters_1st",
      "characters_2nd",
      "characters_3rd",
      "characters_4th",
    ];

    const charactersSet = new Set(charactersArray);

    charactersInputFields.forEach((fieldName, _index) => {
      if (
        data.players === "4" &&
        charactersArray.length !== charactersSet.size
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [fieldName],
          message: "No duplicates allowed",
        });
      }
    });

    charactersInputFields.forEach((fieldName, _index) => {
      if (
        data.players === "4" &&
        charactersArray.some((value) => value === "")
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [fieldName],
          message: "All Characters must have a value",
        });
      }
    });
  })
  .superRefine((data, ctx) => {
    // 3 Player Games
    // ---------------------------
    // Players
    // ---------------------------
    const playersArray = [data.players_1st, data.players_2nd, data.players_3rd];
    const playersSet = new Set(playersArray);

    const playersInputFields = ["players_1st", "players_2nd", "players_3rd"];
    const onlyThreePlayerInputFields = ["players", "players_4th"];

    playersInputFields.forEach((fieldName, _index) => {
      if (data.players === "3" && playersArray.length !== playersSet.size) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [fieldName],
          message: "No duplicates allowed",
        });
      }
    });

    playersInputFields.forEach((fieldName, _index) => {
      if (data.players === "3" && playersArray.some((value) => value === "")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [fieldName],
          message: "All Players must have a value",
        });
      }
    });

    onlyThreePlayerInputFields.forEach((fieldName, _index) => {
      if (data.players === "3" && data.players_4th !== "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [fieldName],
          message: "Fourth player must be null",
        });
      }
    });

    // ---------------------------
    // Characters
    // ---------------------------
    const charactersArray = [
      data.players_1st,
      data.players_2nd,
      data.players_3rd,
    ];

    const charactersInputFields = [
      "characters_1st",
      "characters_2nd",
      "characters_3rd",
    ];

    const onlyThreeCharacterInputFields = ["players", "characters_4th"];

    const charactersSet = new Set(charactersArray);

    charactersInputFields.forEach((fieldName, _index) => {
      if (
        data.players === "3" &&
        charactersArray.length !== charactersSet.size
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [fieldName],
          message: "No duplicates allowed",
        });
      }
    });

    charactersInputFields.forEach((fieldName, _index) => {
      if (
        data.players === "3" &&
        charactersArray.some((value) => value === "")
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [fieldName],
          message: "All Characters must have a value",
        });
      }
    });

    onlyThreeCharacterInputFields.forEach((fieldName, _index) => {
      if (data.players === "3" && data.characters_4th !== "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [fieldName],
          message: "Fourth Character must be null",
        });
      }
    });
  })
  .superRefine((data, ctx) => {
    // 2 Player Games
    // ---------------------------
    // Players
    // ---------------------------
    const playersArray = [data.players_1st, data.players_2nd];
    const playersSet = new Set(playersArray);

    const playersInputFields = ["players_1st", "players_2nd"];
    const onlyTwoPlayerInputFields = ["players", "players_3rd", "players_4th"];

    playersInputFields.forEach((fieldName, _index) => {
      if (data.players === "2" && playersArray.length !== playersSet.size) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [fieldName],
          message: "No duplicates allowed",
        });
      }
    });

    playersInputFields.forEach((fieldName, _index) => {
      if (data.players === "2" && playersArray.some((value) => value === "")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [fieldName],
          message: "All Players must have a value",
        });
      }
    });

    onlyTwoPlayerInputFields.forEach((fieldName, _index) => {
      if (
        data.players === "2" &&
        (data.players_3rd !== "" || data.players_4th !== "")
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [fieldName],
          message: "Third and Fourth players must be null",
        });
      }
    });

    // ---------------------------
    // Characters
    // ---------------------------
    const charactersArray = [data.players_1st, data.players_2nd];

    const charactersInputFields = ["characters_1st", "characters_2nd"];

    const onlyTwoCharacterInputFields = [
      "players",
      "characters_3rd",
      "characters_4th",
    ];

    const charactersSet = new Set(charactersArray);

    charactersInputFields.forEach((fieldName, _index) => {
      if (
        data.players === "2" &&
        charactersArray.length !== charactersSet.size
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [fieldName],
          message: "No duplicates allowed",
        });
      }
    });

    charactersInputFields.forEach((fieldName, _index) => {
      if (
        data.players === "2" &&
        charactersArray.some((value) => value === "")
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [fieldName],
          message: "All Characters must have a value",
        });
      }
    });

    onlyTwoCharacterInputFields.forEach((fieldName, _index) => {
      if (
        data.players === "2" &&
        (data.characters_3rd !== "" || data.characters_4th !== "")
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [fieldName],
          message: "Third and Fourth Characters must be null",
        });
      }
    });
  });

export type TCreateGameSchema = z.infer<typeof CreateGameSchema>;

export const defaultValuesCreateGameSchema: TCreateGameSchema = {
  map: "",
  players: "",
  players_1st: "",
  players_2nd: "",
  players_3rd: "",
  players_4th: "",
  characters_1st: "",
  characters_2nd: "",
  characters_3rd: "",
  characters_4th: "",
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
  map: mapNamesAlphabeticalEnum.options[0],
  players: gameType.options[0],
  players_1st: "",
  players_2nd: "",
  players_3rd: "",
  players_4th: "",
  characters_1st: characterNamesEnum.options[0],
  characters_2nd: characterNamesEnum.options[1],
  characters_3rd: characterNamesEnum.options[2],
  characters_4th: characterNamesEnum.options[3],
  // TODO: getCurrentSeason fetch service
  season: 0,
};

export type TUpdateGameState = {
  errors?: Partial<TCreateGameSchema>;
  message?: string | null;
};
