"use client";
import { useMemo, useState } from "react";
import { SellTicketsModal } from "./sell-ticket-modal";
import { PencilIcon, PlusIcon } from "@heroicons/react/24/outline";

type Ticket = {
  id: string;
  purchase_date: string;
  airline: string;
  route: string;
  pnr: string;
  pax: number;
  ticket_price: number;
  selling_price: number;
  sold?: boolean;
  available: number;
  is_umrah: boolean;
  umrah_group_id?: string;
};

interface Group {
  month: string;
  id: string;
  name: string;
  created_at: string;
  pnr_list: Ticket[];
  created_by: string;
}

type Props = {
  tickets: Ticket[];
  umrahGroups: Group[];
};

export default function UmrahGroupsTable({ tickets, umrahGroups }: Props) {

  const [selectedTickets, setSelectedTickets] = useState<Ticket[]>([]);
  const [showSellTicketModal, setShowSellTicketModal] = useState(false);


  const groupedByMonth = useMemo(() => {
    const grouped: Record<string, Group[]> = {};
    umrahGroups.forEach((group) => {
      if (!grouped[group.month]) grouped[group.month] = [];
      grouped[group.month].push(group);
    });
    return grouped;
  }, [umrahGroups]);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="relative px-4 py-6 space-y-4">
            {showSellTicketModal && selectedTickets.length > 0 && (
              <SellTicketsModal
                selectedTickets={selectedTickets}
                setShowSellTicketModal={setShowSellTicketModal}
              />
            )}

            {/* Umrah Groups Section */}
            <div className="space-y-6">
              {Object.entries(groupedByMonth)
                .sort((a, b) => b[0].localeCompare(a[0]))
                .map(([month, groups]) => (
                  <div key={month}>
                    <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      {new Date(`${month}-01`).toLocaleDateString("default", {
                        month: "long",
                        year: "numeric",
                      })}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {groups.map((group) => (
                        <div
                          key={group.id}
                          //   onClick={() => toggleSelect(group.id)}
                          className={`border rounded-md p-4 transition hover:bg-gray-100 dark:hover:bg-gray-800`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-sm font-medium uppercase text-gray-700 dark:text-gray-200">
                              {group.name}
                            </h4>
                            <div className="flex space-x-5">
                              <PlusIcon
                                title="Add Passenger"
                                className="w-4 h-4 text-gray-500 cursor-pointer"
                                onClick={() => {
                                  console.log("plus-clicked");
                                  setSelectedTickets(group.pnr_list);
                                  setShowSellTicketModal(true);
                                }}
                              />
                              <PencilIcon
                                title="Edit Group"
                                className="w-4 h-4 text-gray-500 cursor-pointer"
                                onClick={() => console.log("group-clicked")}
                              />
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mb-1">
                            Created by: <strong>{group.created_by}</strong> on{" "}
                            {new Date(group.created_at).toLocaleDateString()}
                          </p>
                          <ul className="text-sm text-gray-700 dark:text-gray-300 list-none list-inside mt-2">
                            {group.pnr_list.map((pnr, idx) => (
                              <li key={pnr.id}>
                                <span className="mr-2 text-teal-600">
                                  &#128743;
                                </span>
                                <span className="uppercase">{pnr.route}</span> • <strong>{pnr.pnr}</strong> - {pnr.pax} PAX (
                                {pnr.available} Available) • ৳ {pnr.ticket_price}/{pnr.selling_price}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
