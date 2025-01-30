import LatestGamesTable from '@/components/ui/games/latest-games-table';
import Pagination from '@/components/ui/invoices/pagination';
import Search from '@/components/ui/search';
import { CreateGame } from '@/components/ui/games/buttons';
import { fetchGamesPages } from '@/app/lib/data';
import { lusitana } from '@/components/ui/fonts';
import { Suspense } from 'react';

// import { InvoicesTableSkeleton } from "@/components/ui/skeletons";

export default async function Page(props: {
  // Define optional search params that can be passed to the route URL
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await fetchGamesPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Games</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search games..." />
        <CreateGame />
      </div>
      {/* <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}> */}
      <Suspense key={query + currentPage}>
        <LatestGamesTable query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
