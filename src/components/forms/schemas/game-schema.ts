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
  // ------------------------------------------------------
  // Game Type
  // ------------------------------------------------------
  .superRefine((data, ctx) => {
    if (data.players === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["players"],
        message: "Game type must be specified",
      });
    }
  })
  // ------------------------------------------------------
  // Map
  // ------------------------------------------------------
  .superRefine((data, ctx) => {
    if (data.map === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["map"],
        message: "Map must be specified",
      });
    }
  })
  // ------------------------------------------------------
  // 4 Player Games
  // ------------------------------------------------------
  // ---------------------------------------
  // Players 4P
  // ---------------------------------------
  .superRefine((data, ctx) => {
    // -------------------
    // Players (Unique)
    // -------------------
    const playersArrayFour = [
      data.players_1st,
      data.players_2nd,
      data.players_3rd,
      data.players_4th,
    ];

    const playersInputFieldsFour = [
      "players_1st",
      "players_2nd",
      "players_3rd",
      "players_4th",
    ];

    const playersSetFour = new Set(playersArrayFour);

    playersInputFieldsFour.forEach((fieldName, _index) => {
      if (
        data.players === "4" &&
        playersArrayFour.length !== playersSetFour.size
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [fieldName],
          message: "No duplicates allowed",
        });
      }
    });
  })
  .superRefine((data, ctx) => {
    // -------------------
    // Players (Not Null)
    // -------------------
    const playersArrayFour = [
      data.players_1st,
      data.players_2nd,
      data.players_3rd,
      data.players_4th,
    ];

    const playersInputFieldsFour = [
      "players_1st",
      "players_2nd",
      "players_3rd",
      "players_4th",
    ];

    playersInputFieldsFour.forEach((fieldName, _index) => {
      if (
        data.players === "4" &&
        playersArrayFour.some((value) => value === "")
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [fieldName],
          message: "All Players must have a value",
        });
      }
    });
  })
  // ---------------------------------------
  // Characters 4P
  // ---------------------------------------
  .superRefine((data, ctx) => {
    // -------------------
    // Characters (Unique)
    // -------------------
    const charactersArrayFour = [
      data.characters_1st,
      data.characters_2nd,
      data.characters_3rd,
      data.characters_4th,
    ];

    const charactersInputFieldsFour = [
      "characters_1st",
      "characters_2nd",
      "characters_3rd",
      "characters_4th",
    ];

    const charactersSetFour = new Set(charactersArrayFour);

    charactersInputFieldsFour.forEach((fieldName, _index) => {
      if (
        data.players === "4" &&
        charactersArrayFour.length !== charactersSetFour.size
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [fieldName],
          message: "No duplicates allowed",
        });
      }
    });
  })
  .superRefine((data, ctx) => {
    // -------------------
    // Characters (Not Null)
    // -------------------
    const charactersArrayFour = [
      data.characters_1st,
      data.characters_2nd,
      data.characters_3rd,
      data.characters_4th,
    ];

    const charactersInputFieldsFour = [
      "characters_1st",
      "characters_2nd",
      "characters_3rd",
      "characters_4th",
    ];

    charactersInputFieldsFour.forEach((fieldName, _index) => {
      if (
        data.players === "4" &&
        charactersArrayFour.some((value) => value === "")
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [fieldName],
          message: "All Characters must have a value",
        });
      }
    });
  })
  // ------------------------------------------------------
  // 3 Player Games
  // ------------------------------------------------------
  .superRefine((data, ctx) => {
    // ---------------------------------------
    // Players 3P
    // ---------------------------------------
    const playersArrayThree = [
      data.players_1st,
      data.players_2nd,
      data.players_3rd,
    ];
    const playersSetThree = new Set(playersArrayThree);

    const playersInputFieldsThree = [
      "players_1st",
      "players_2nd",
      "players_3rd",
    ];
    const onlyThreePlayerInputFields = ["players", "players_4th"];

    // -------------------
    // Players (Unique)
    // -------------------
    playersInputFieldsThree.forEach((fieldName, _index) => {
      if (
        data.players === "3" &&
        playersArrayThree.length !== playersSetThree.size
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [fieldName],
          message: "No duplicates allowed",
        });
      }
    });

    // -------------------
    // Players (Not Null)
    // -------------------
    playersInputFieldsThree.forEach((fieldName, _index) => {
      if (
        data.players === "3" &&
        playersArrayThree.some((value) => value === "")
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [fieldName],
          message: "All Players must have a value",
        });
      }
    });

    // -------------------
    // Players (4th Player Explicit Null)
    // -------------------
    onlyThreePlayerInputFields.forEach((fieldName, _index) => {
      if (data.players === "3" && data.players_4th !== "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [fieldName],
          message: "Fourth player must be null",
        });
      }
    });

    // ---------------------------------------
    // Characters 3P
    // ---------------------------------------
    const charactersArrayThree = [
      data.characters_1st,
      data.characters_2nd,
      data.characters_3rd,
    ];

    const charactersInputFieldsThree = [
      "characters_1st",
      "characters_2nd",
      "characters_3rd",
    ];

    const onlyCharacterInputFieldsThree = ["players", "characters_4th"];

    const charactersSetThree = new Set(charactersArrayThree);

    // -------------------
    // Characters (Unique)
    // -------------------
    charactersInputFieldsThree.forEach((fieldName, _index) => {
      if (
        data.players === "3" &&
        charactersArrayThree.length !== charactersSetThree.size
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [fieldName],
          message: "No duplicates allowed",
        });
      }
    });

    // -------------------
    // Characters (Not Null)
    // -------------------
    charactersInputFieldsThree.forEach((fieldName, _index) => {
      if (
        data.players === "3" &&
        charactersArrayThree.some((value) => value === "")
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [fieldName],
          message: "All Characters must have a value",
        });
      }
    });

    // -------------------
    // Characters (4th Character Explicit Null)
    // -------------------
    onlyCharacterInputFieldsThree.forEach((fieldName, _index) => {
      if (data.players === "3" && data.characters_4th !== "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [fieldName],
          message: "Fourth Character must be null",
        });
      }
    });
  })
  // ------------------------------------------------------
  // 2 Player Games
  // ------------------------------------------------------
  .superRefine((data, ctx) => {
    // ---------------------------------------
    // Players 2P
    // ---------------------------------------
    const playersArrayTwo = [data.players_1st, data.players_2nd];
    const playersSetTwo = new Set(playersArrayTwo);

    const playersInputFieldsTwo = ["players_1st", "players_2nd"];
    const onlyPlayerInputFieldsTwo = ["players", "players_3rd", "players_4th"];

    // -------------------
    // Players (Unique)
    // -------------------
    playersInputFieldsTwo.forEach((fieldName, _index) => {
      if (
        data.players === "2" &&
        playersArrayTwo.length !== playersSetTwo.size
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [fieldName],
          message: "No duplicates allowed",
        });
      }
    });

    // -------------------
    // Players (Not Null)
    // -------------------
    playersInputFieldsTwo.forEach((fieldName, _index) => {
      if (
        data.players === "2" &&
        playersArrayTwo.some((value) => value === "")
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [fieldName],
          message: "All Players must have a value",
        });
      }
    });

    // -------------------
    // Players (4th and 3rd Player Explicit Null)
    // -------------------
    onlyPlayerInputFieldsTwo.forEach((fieldName, _index) => {
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

    // ---------------------------------------
    // Characters 2P
    // ---------------------------------------
    const charactersArrayTwo = [data.characters_1st, data.characters_2nd];

    const charactersInputFieldsTwo = ["characters_1st", "characters_2nd"];

    const onlyCharacterInputFieldsTwo = [
      "players",
      "characters_3rd",
      "characters_4th",
    ];

    const charactersSetTwo = new Set(charactersArrayTwo);

    // -------------------
    // Characters (Unique)
    // -------------------
    charactersInputFieldsTwo.forEach((fieldName, _index) => {
      if (
        data.players === "2" &&
        charactersArrayTwo.length !== charactersSetTwo.size
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [fieldName],
          message: "No duplicates allowed",
        });
      }
    });

    // -------------------
    // Characters (Not Null)
    // -------------------
    charactersInputFieldsTwo.forEach((fieldName, _index) => {
      if (
        data.players === "2" &&
        charactersArrayTwo.some((value) => value === "")
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [fieldName],
          message: "All Characters must have a value",
        });
      }
    });

    // -------------------
    // Characters (4th and 3rd Character Explicit Null)
    // -------------------
    onlyCharacterInputFieldsTwo.forEach((fieldName, _index) => {
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

// Combine server side calculated fields from general schema with..
// ..superRefine validated fields?
// TODO: this probably won't work, will need a new zod schema lol
export type TUpdateGameSchema = z.infer<typeof CreateGameSchema> &
  Pick<
    z.infer<typeof GameSchema>,
    "id" | "timestamp" | "new_session" | "suid" | "season"
  >;

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
