import { fetchFilteredSales } from "@/app/lib/data";
import SalesList from "./sales-list";
import { Suspense } from "react";
import { SalesSkeleton } from "../skeletons";

export default async function SalesListServer({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const sales = await fetchFilteredSales(query, currentPage);

  const typedSales = sales.map((sale: any) => ({
    ...sale,
    pnr_list: sale.pnr_list.map((pnr: any) => ({
      id: pnr.id,
      airline: pnr.airline,
      route: pnr.route,
      pnr: pnr.pnr,
      pax: pnr.pax,
      purchase_date: pnr.purchase_date,
      ticket_price: pnr.ticket_price,
      selling_price: pnr.selling_price,
      available: pnr.available,
      is_umrah: pnr.is_umrah,
    })),
    passenger_list: sale.passenger_list.map((passenger: any) => ({
      id: passenger.id,
      name: passenger.name,
      passport_no: passenger.passport_no,
      due_amount: passenger.due_amount,
      // add other required passenger fields here
    })),
  }));

  return (
    <>
        <SalesList sales={typedSales} />
    </>
  );
}
