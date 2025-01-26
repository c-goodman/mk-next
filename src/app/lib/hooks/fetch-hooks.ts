"use server";

import { fetchUserByEmail, fetchUserByName, fetchUserNames } from "../data";

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
