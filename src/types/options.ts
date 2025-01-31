import { z } from "zod";

// TODO: Get values from Users table
export const tempPlayerNames = [
  "Cooper",
  "Blake",
  "Cole",
  "Regan",
  "Matt",
  "Connor",
  "Konnor",
  "Garrett",
  "Domingo",
  "Colton",
  "Luke",
  "Antonio",
  "Triston",
  "Robert",
  "Randy",
  "Chandler",
  "Sam",
  "Hughes",
  "Joey",
  "Jake",
  "Mikey",
  "Martin",
  "Kali",
  "Sudur",
  "Anthony",
  "Kayla",
  "Graber",
  "Caskey",
  "Justin",
  "Kieran",
  "Mitch",
  "Ben",
  "Billy",
  "Coop W",
  "Andrew",
  "Duncan P",
  "Austin",
  "Miller",
  "Chloe",
];

export const tempPlayerNamesEnum = z.enum([
  "Cooper",
  "Blake",
  "Cole",
  "Regan",
  "Matt",
  "Connor",
  "Konnor",
  "Garrett",
  "Domingo",
  "Colton",
  "Luke",
  "Antonio",
  "Triston",
  "Robert",
  "Randy",
  "Chandler",
  "Sam",
  "Hughes",
  "Joey",
  "Jake",
  "Mikey",
  "Martin",
  "Kali",
  "Sudur",
  "Anthony",
  "Kayla",
  "Graber",
  "Caskey",
  "Justin",
  "Kieran",
  "Mitch",
  "Ben",
  "Billy",
  "Coop W",
  "Andrew",
  "Duncan P",
  "Austin",
  "Miller",
  "Chloe",
]);

export const tempPlayerNamesSelectOption = tempPlayerNamesEnum.options.map(
  (val) => ({
    value: val,
    label: val,
  })
);

export const characterNames = z.enum([
  "Peach",
  "Toad",
  "Yoshi",
  "Bowser",
  "Luigi",
  "Mario",
  "Wario",
  "D.K.",
]);

export const characterNamesSelectOptions = characterNames.options.map(
  (val) => ({
    value: val,
    label: val,
  })
);

export const mapNamesFrequency = z.enum([
  "Wario Stadium",
  "Toad's Turnpike",
  "Koopa Troopa Beach",
  "Yoshi Valley",
  "D.K.'s Jungle",
  "Sherbet Land",
  "Royal Raceway",
  "Bowser's Castle",
  "Kalimari Desert",
  "Banshee Boardwalk",
  "Frappe Snowland",
  "Choco Mountain",
  "Mario Raceway",
  "Luigi Raceway",
  "Moo Moo Farm",
]);

export const mapNamesFrequencySelectOptions = mapNamesFrequency.options.map(
  (val) => ({
    value: val,
    label: val,
  })
);

export const mapNamesAlphabetical = z.enum([
  "Banshee Boardwalk",
  "Bowser's Castle",
  "Choco Mountain",
  "D.K.'s Jungle",
  "Frappe Snowland",
  "Kalimari Desert",
  "Koopa Troopa Beach",
  "Luigi Raceway",
  "Mario Raceway",
  "Moo Moo Farm",
  "Royal Raceway",
  "Sherbet Land",
  "Toad's Turnpike",
  "Wario Stadium",
  "Yoshi Valley",
]);

export const mapNamesAlphabeticalSelectOptions =
  mapNamesAlphabetical.options.map((val) => ({
    value: val,
    label: val,
  }));

export const gameType = z.enum(["4", "3", "2"]);

export const gameTypeSelectOptions = gameType.options.map((val) => ({
  value: val,
  label: val,
}));
