import { fetchAllUmrahGroups, fetchFilteredTickets, fetchFilteredUmrahGroups } from "@/app/lib/data";
import TicketsTable from "./table";
import UmrahGroupsTable from "./umrah-groups-table";
import { Suspense } from "react";
import { TicketListFallback } from "../skeletons";

export default async function TicketsTableServer({
  query,
  currentPage,
  type,
}: {
  query: string;
  currentPage: number;
  type: string;
}) {
  const tickets = await fetchFilteredTickets(query, currentPage);
  const umrahGroups = await fetchAllUmrahGroups();
  
  const filteredUmrahGroupsRaw = await fetchFilteredUmrahGroups(query, currentPage);
  console.log(tickets);

  // Map Document[] to Ticket[] for each group
  const filteredUmrahGroups = filteredUmrahGroupsRaw.map((group: any) => ({
    ...group,
    pnr_list: group.pnr_list.map((doc: any) => ({
      id: doc.id,
      airline: doc.airline,
      purchase_date: doc.purchase_date,
      route: doc.route,
      pnr: doc.pnr,
      pax: doc.pax,
      available: doc.available,
      ticket_price: doc.ticket_price,
      selling_price: doc.selling_price,
      // add any other Ticket fields as needed
    })),
  }));

  return (
    <>
      {type === "list" && (
        <TicketsTable tickets={tickets} umrahGroups={umrahGroups} />
      )}
      {type === "group" && (
        <UmrahGroupsTable tickets={tickets} umrahGroups={filteredUmrahGroups} />
      )}
    </>
  );
}
