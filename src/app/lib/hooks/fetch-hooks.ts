"use server";

// import { cache } from "react";
import {
  fetchCharacters,
  fetchEloPerSeason,
  fetchMaps,
  fetchUserByEmail,
  fetchUserByName,
  fetchUserNames,
} from "../data";
import { TCharactersTable, TEloSeasonTable, TMapsTable } from "../definitions";

export async function useFetchUserNames(): Promise<string[]> {
  const [userNames] = await Promise.all([fetchUserNames()]);

  return userNames;
}

export async function useFetchUserByName(name: string) {
  const user = await Promise.all([fetchUserByName(name)]);

  return user;
}

export async function useFetchUserByEmail(email: string) {
  const user = await Promise.all([fetchUserByEmail(email)]);

  return user;
}

export async function useFetchCharacters(): Promise<TCharactersTable[]> {
  const [characters] = await Promise.all([fetchCharacters()]);

  return characters;
}

export async function useFetchMaps(): Promise<TMapsTable[]> {
  const [maps] = await Promise.all([fetchMaps()]);

  return maps;
}

export async function useFetchEloSeason(
  season: number
): Promise<TEloSeasonTable[] | undefined> {
  const eloSeason = await fetchEloPerSeason(season);

  if (!eloSeason) return;

  return eloSeason;
}

// export const useFetchCharacters = cache(async () => {
//   const characters = await fetchCharacters();

//   if (!characters) notFound();
//   return characters;
// });
