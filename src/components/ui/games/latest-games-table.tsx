// import { UpdateInvoice, DeleteInvoice } from '@/components/ui/invoices/buttons';
import { formatUTCTimestampToLocalISOString } from "@/app/lib/utils";
import { fetchFilteredGames } from "@/app/lib/data";

export default async function LatestGamesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const games = await fetchFilteredGames(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {games?.map((game) => (
              <div
                key={game.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>
                        {formatUTCTimestampToLocalISOString(game.timestamp)}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">{game.map}</p>
                  </div>
                  <p className="text-sm text-gray-500">{game.players}</p>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">{game.players_1st}</p>
                    <p>{game.players_2nd}</p>
                  </div>
                  {/* <div className="flex justify-end gap-2">
                                        <UpdateInvoice id={invoice.id} />
                                        <DeleteInvoice id={invoice.id} />
                                    </div> */}
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  New Session
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  SUID
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Map
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Players
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  1st
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  2nd
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  3rd
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  4th
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {games?.map((game) => (
                <tr
                  key={game.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>
                        {formatUTCTimestampToLocalISOString(game.timestamp)}
                      </p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {game.new_session}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{game.suid}</td>
                  <td className="whitespace-nowrap px-3 py-3">{game.map}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {game.players}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {game.players_1st}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {game.players_2nd}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {game.players_3rd}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {game.players_4th}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    {/* <div className="flex justify-end gap-3">
                                            <UpdateInvoice id={invoice.id} />
                                            <DeleteInvoice id={invoice.id} />
                                        </div> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
