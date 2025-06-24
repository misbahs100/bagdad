import {  fetchTicketsPages } from "@/app/lib/data";
import Pagination from "../pagination";

export default async function TicketPagination({
    query,
}: {
  query: string;
}) {
  const totalPages = await fetchTicketsPages(query);

  return (
    <div className="mt-5 flex w-full justify-center">
      <Pagination totalPages={totalPages} />
    </div>
  );
}