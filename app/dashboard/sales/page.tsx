import Search from "@/app/ui/search";
import { lusitana } from "@/app/ui/fonts";
import { Metadata } from "next";
import { fetchFilteredSales } from "@/app/lib/data";
import SalesListServer from "@/app/ui/sales/sales-list-server";
import { Suspense } from "react";
import { PaginationSkeleton, SalesSkeleton } from "@/app/ui/skeletons";
import SalesPagination from "@/app/ui/sales/pagination";

export const metadata: Metadata = {
  title: "Sales",
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
        <h1 className={`${lusitana.className} text-2xl`}>Sales</h1>
      </div>
      <div className="my-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search PNR, Route, Airline..." />
      </div>

 
      <Suspense fallback={<SalesSkeleton />}>
      <SalesListServer query={query} currentPage={currentPage} />
      </Suspense>

      <div className="mt-5 flex w-full justify-center">
        <Suspense fallback={<PaginationSkeleton />}>
          <SalesPagination query={query} />
        </Suspense>
      </div>
    </div>
  );
}
