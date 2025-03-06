import { ArrowPathIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Image from "next/image";
import { lusitana } from "@/components/ui/fonts";
// import { LatestInvoice } from '@/app/lib/definitions';
import { fetchCharacters, fetchLatestGames } from "@/app/lib/data";
import { TGamesTable } from "@/app/lib/definitions";

export default async function LatestGames() {
  const latestGames = await fetchLatestGames();
  const characters = await fetchCharacters();

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Latest Games
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <div className="bg-white px-2">
          {latestGames.map((data: TGamesTable, i) => {
            return (
              <div
                key={data.id}
                className={clsx(
                  "flex flex-row items-center justify-between py-4",
                  {
                    "border-t": i !== 0,
                  }
                )}
              >
                <div className="flex flex-row items-start">
                  <div className="min-w-0 mr-4">
                    <div className="truncate text-sm md:text-base">
                      {`G${data.id}`}
                    </div>
                    <div className="truncate text-sm md:text-base">
                      {`S${data.suid}`}
                    </div>
                    <div className="truncate text-sm md:text-base">
                      {`${data.players}P`}
                    </div>
                  </div>
                  <div className="min-w-0 mr-4">
                    <div className="truncate text-sm md:text-base">
                      {`${data.players_1st}`}
                    </div>
                    <div className="text-xs text-gray-500">
                      {data.players_2nd}
                    </div>
                    <div className="text-xs text-gray-500">
                      {data.players_3rd}
                    </div>
                    <div className="text-xs text-gray-500">
                      {data.players_4th}
                    </div>
                  </div>
                  <div className="min-w-0 text-xs text-gray-500 mr-2">
                    <Image
                      src={data.image_url}
                      alt={`${data.map} picture`}
                      className="mr-4 rounded-sm"
                      width={80}
                      height={80}
                    />
                    {data.map.split(" ")[0].replace("'s", "")}
                  </div>
                  <div className="flex flex-row min-w-0 mr-2">
                    <div className="text-xs text-gray-500 mr-2">
                      <Image
                        src={
                          characters
                            .filter((c) => c.character === data.characters_1st)
                            .map((e) => e.image_url_portrait_won)[0]
                        }
                        className="rounded-full"
                        width={50}
                        height={50}
                        alt={`First place character picture`}
                      />
                      {data.characters_1st}
                    </div>
                    <div className="hidden text-xs text-gray-500 mr-2 sm:block">
                      <Image
                        src={
                          characters
                            .filter((c) => c.character === data.characters_2nd)
                            .map((e) => e.image_url_portrait_lost)[0]
                        }
                        className="rounded-full"
                        width={30}
                        height={30}
                        alt={`First place character picture`}
                      />
                      {data.characters_2nd}
                    </div>
                    {data.characters_3rd && (
                      <div className="hidden text-xs text-gray-500 mr-2 sm:block">
                        <Image
                          src={
                            characters
                              .filter(
                                (c) => c.character === data.characters_3rd
                              )
                              .map((e) => e.image_url_portrait_lost)[0]
                          }
                          className="rounded-full"
                          width={30}
                          height={30}
                          alt={`First place character picture`}
                        />
                        {data.characters_3rd}
                      </div>
                    )}
                    {data.characters_4th && (
                      <div className="hidden text-xs text-gray-500 mr-2 sm:block">
                        <Image
                          src={
                            characters
                              .filter(
                                (c) => c.character === data.characters_4th
                              )
                              .map((e) => e.image_url_portrait_lost)[0]
                          }
                          className="rounded-full"
                          width={30}
                          height={30}
                          alt={`First place character picture`}
                        />
                        {data.characters_4th}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}
