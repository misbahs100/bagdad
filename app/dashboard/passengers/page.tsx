import Search from "@/app/ui/search";
import { lusitana } from "@/app/ui/fonts";
import { Suspense } from "react";
import { Metadata } from "next";
import { CreateUser } from "@/app/ui/users/buttons";
import UsersTable from "@/app/ui/users/table";
import { PaginationSkeleton, UsersTableSkeleton } from "@/app/ui/skeletons";
import UserPagination from "@/app/ui/users/pagination";
import PassengersTableServer from "@/app/ui/passengers/table-server";
import PassengerPagination from "@/app/ui/passengers/pagination";
import { SendNotification } from "@/app/ui/sales/buttons";


export const metadata: Metadata = {
  title: "Passengers",
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
        <h1 className={`${lusitana.className} text-2xl`}>Passengers</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search passengers..." />
        <SendNotification />
      </div>
      <Suspense key={query + currentPage} fallback={<UsersTableSkeleton />}>
        <PassengersTableServer query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Suspense fallback={<PaginationSkeleton />}>
          <PassengerPagination query={query} />
        </Suspense>
      </div>
    </div>
  );

}
