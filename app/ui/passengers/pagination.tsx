import { fetchPassengersPages } from "@/app/lib/data";
import Pagination from "../pagination";

export default async function PassengerPagination({
    query,
}: {
  query: string;
}) {
  const totalPages = await fetchPassengersPages(query);

  return (
    <div className="mt-5 flex w-full justify-center">
      <Pagination totalPages={totalPages} />
    </div>
  );
}