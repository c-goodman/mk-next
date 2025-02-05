import { z } from "zod";

// ----------------------------------------------
// Player Names
// ----------------------------------------------
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
] as const;

export const playerNamesComboboxOptions = [
  { label: "Cooper", value: "Cooper" },
  { label: "Blake", value: "Blake" },
  { label: "Cole", value: "Cole" },
  { label: "Regan", value: "Regan" },
  { label: "Matt", value: "Matt" },
  { label: "Connor", value: "Connor" },
  { label: "Konnor", value: "Konnor" },
  { label: "Garrett", value: "Garrett" },
  { label: "Domingo", value: "Domingo" },
  { label: "Colton", value: "Colton" },
  { label: "Luke", value: "Luke" },
  { label: "Antonio", value: "Antonio" },
  { label: "Triston", value: "Triston" },
  { label: "Robert", value: "Robert" },
  { label: "Randy", value: "Randy" },
  { label: "Chandler", value: "Chandler" },
  { label: "Sam", value: "Sam" },
  { label: "Hughes", value: "Hughes" },
  { label: "Joey", value: "Joey" },
  { label: "Jake", value: "Jake" },
  { label: "Mikey", value: "Mikey" },
  { label: "Martin", value: "Martin" },
  { label: "Kali", value: "Kali" },
  { label: "Sudur", value: "Sudur" },
  { label: "Anthony", value: "Anthony" },
  { label: "Kayla", value: "Kayla" },
  { label: "Graber", value: "Graber" },
  { label: "Caskey", value: "Caskey" },
  { label: "Justin", value: "Justin" },
  { label: "Kieran", value: "Kieran" },
  { label: "Mitch", value: "Mitch" },
  { label: "Ben", value: "Ben" },
  { label: "Billy", value: "Billy" },
  { label: "Coop W", value: "Coop W" },
  { label: "Andrew", value: "Andrew" },
  { label: "Duncan P", value: "Duncan P" },
  { label: "Austin", value: "Austin" },
  { label: "Miller", value: "Miller" },
  { label: "Chloe", value: "Chloe" },
] as const;

export const tempPlayerNamesEnum = z.enum(tempPlayerNames);

export const tempPlayerNamesSelectOption = tempPlayerNames.map((val) => ({
  value: val,
  label: val,
}));

// ----------------------------------------------
// Character Names
// ----------------------------------------------
export const characterNames = [
  "Peach",
  "Toad",
  "Yoshi",
  "Bowser",
  "Luigi",
  "Mario",
  "Wario",
  "D.K.",
] as const;

export const characterNamesComboboxOptions = [
  { label: "Peach", value: "Peach" },
  { label: "Toad", value: "Toad" },
  { label: "Yoshi", value: "Yoshi" },
  { label: "Bowser", value: "Bowser" },
  { label: "Luigi", value: "Luigi" },
  { label: "Mario", value: "Mario" },
  { label: "Wario", value: "Wario" },
  { label: "D.K.", value: "D.K." },
] as const;

export const characterNamesEnum = z.enum(characterNames);

export const characterNamesSelectOptions = characterNamesEnum.options.map(
  (val) => ({
    value: val,
    label: val,
  })
);

// ----------------------------------------------
// Maps
// ----------------------------------------------
// Frequency
// -----------------------
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
] as const);

export const mapNamesFrequencySelectOptions = mapNamesFrequency.options.map(
  (val) => ({
    value: val,
    label: val,
  })
);

// Alphabetical
// -----------------------
export const mapNamesAlphabeticalEnum = z.enum([
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
] as const);

export const mapNamesAlphabeticalComboboxOptions = [
  { label: "Banshee Boardwalk", value: "Banshee Boardwalk" },
  { label: "Bowser's Castle", value: "Bowser's Castle" },
  { label: "Choco Mountain", value: "Choco Mountain" },
  { label: "D.K.'s Jungle", value: "D.K.'s Jungle" },
  { label: "Frappe Snowland", value: "Frappe Snowland" },
  { label: "Kalimari Desert", value: "Kalimari Desert" },
  { label: "Koopa Troopa Beach", value: "Koopa Troopa Beach" },
  { label: "Luigi Raceway", value: "Luigi Raceway" },
  { label: "Mario Raceway", value: "Mario Raceway" },
  { label: "Moo Moo Farm", value: "Moo Moo Farm" },
  { label: "Royal Raceway", value: "Royal Raceway" },
  { label: "Sherbet Land", value: "Sherbet Land" },
  { label: "Toad's Turnpike", value: "Toad's Turnpike" },
  { label: "Wario Stadium", value: "Wario Stadium" },
  { label: "Yoshi Valley", value: "Yoshi Valley" },
] as const;

export const mapNamesAlphabeticalSelectOptions =
  mapNamesAlphabeticalEnum.options.map((val) => ({
    value: val,
    label: val,
  }));

// ----------------------------------------------
// Game Type
// ----------------------------------------------
export const gameType = z.enum(["4", "3", "2"] as const);

export const gameTypeSelectOptions = gameType.options.map((val) => ({
  value: val,
  label: val,
}));
