import { fetchFilteredPassengers } from "@/app/lib/data";
import PassengersTable from "./table";

export default async function PassengersTableServer({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const documents = await fetchFilteredPassengers(query, currentPage);
  // Map Document[] to Passenger[]
  const passengers = documents.map((doc: any) => ({
    id: doc.id,
    name: doc.name,
    passport_no: doc.passport_no,
    route: doc.route,
    phone: doc.phone,
    gender: doc.gender,
    nationality: doc.nationality,
    created_at: doc.created_at,
    due_amount: doc.due_amount,
    sold_by: doc.sold_by,
    ticket_id: doc.ticket_id,
    pnr_info: {
      pnr: doc.pnr_info.pnr,
      airline: doc.pnr_info.airline,
      route: doc.pnr_info.route,
      ticket_price: doc.pnr_info.ticket_price,
      selling_price: doc.pnr_info.selling_price,
      available: doc.pnr_info.available,
      purchase_date: doc.pnr_info.purchase_date,
    },
  }));
  return(<>
  <PassengersTable passengers={passengers} />
  </>)
}