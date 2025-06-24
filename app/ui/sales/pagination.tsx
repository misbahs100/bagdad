import { fetchSalesPages } from "@/app/lib/data";
import Pagination from "../pagination";

export default async function SalesPagination({
    query,
}: {
  query: string;
}) {
  const totalPages = await fetchSalesPages(query);

  return (
    <div className="mt-5 flex w-full justify-center">
      <Pagination totalPages={totalPages} />
    </div>
  );
}