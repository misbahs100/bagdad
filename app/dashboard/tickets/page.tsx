import Search from "@/app/ui/search";
import { lusitana } from "@/app/ui/fonts";
import { Metadata } from "next";
import { Suspense } from "react";
import { PaginationSkeleton, TicketListFallback } from "@/app/ui/skeletons";
import TicketsTableServer from "@/app/ui/tickets/table-server";
import Link from "next/link";
import TicketPagination from "@/app/ui/tickets/pagination";

export const metadata: Metadata = {
  title: "Tickets",
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Tickets</h1>
      </div>
      <div className="my-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search PNR, Route, Airline..." />
      </div>

      <div className="my-4 flex items-center  gap-2 md:mt-8">
        <Link href="/dashboard/tickets">
          <button className="border rounded px-4 py-1 bg-teal-100">PNRs</button>
        </Link>
        <Link href="/dashboard/tickets/umrah-groups">
          <button className="border rounded px-4 py-1">Umrah Groups</button>
        </Link>
      </div>

      <Suspense key={query + currentPage} fallback={<TicketListFallback />}>
        <TicketsTableServer
          query={query}
          currentPage={currentPage}
          type="list"
        />
      </Suspense>

      <div className="mt-5 flex w-full justify-center">
        <Suspense fallback={<PaginationSkeleton />}>
          <TicketPagination query={query} />
        </Suspense>
      </div>
    </div>
  );
}
