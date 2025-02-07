// import type { NextApiRequest, NextApiResponse } from "next";
// import { TCharactersTable } from "../lib/definitions";
// import { fetchCharacters } from "../lib/data";

// export default async function getCharacters(
//   req: NextApiRequest,
//   res: NextApiResponse<TCharactersTable[]>
// ) {
//   try {
//     const {characters} = await fetchCharacters();
//     res.status(200).json({characters.body});
//   } catch (err) {
//     res.status(500).send({ error: "Failed to fetch data" });
//   }
// }

// https://nextjs.org/docs/pages/building-your-application/routing/api-routes
// https://swr.vercel.app/docs/getting-started