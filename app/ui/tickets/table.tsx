"use client";
import React, { useMemo, useState } from "react";
import { SellTicketsModal } from "./sell-ticket-modal";
import { PencilIcon } from "@heroicons/react/24/outline";
import { UmrahGroupModal } from "./umrah-group-modal";

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
  umrah_group_id: string;
};

interface Group {
  month: string;
  id: string;
  name: string;
  created_at: string;
  pnr_list: string[];
  created_by: string;
}

type Props = {
  tickets: Ticket[];
  umrahGroups: Group[];
};

export default function TicketsTable({ tickets, umrahGroups }: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showSellTicketModal, setShowSellTicketModal] = useState(false);
  const [showUmrahGroupModal, setShowUmrahGroupModal] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState<Ticket[]>([]);

  // Group tickets by purchase_date
  const groupedTickets = useMemo(() => {
    const grouped: Record<string, Ticket[]> = {};
    tickets.forEach((ticket) => {
      if (!grouped[ticket.purchase_date]) grouped[ticket.purchase_date] = [];
      grouped[ticket.purchase_date].push(ticket);
    });
    return grouped;
  }, [tickets]);

  const toggleSelect = (id: string) => {
    const ticket = tickets.find((t) => t.id === id);
    if (!ticket) return;

    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });

    setSelectedTickets((prev) => {
      const exists = prev.some((t) => t.id === id);
      if (exists) {
        return prev.filter((t) => t.id !== id);
      } else {
        return [...prev, ticket];
      }
    });

    console.log(ticket); // will only log once per click
  };

  const isSelected = (id: string) => selectedIds.has(id);
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="relative px-4 py-6 space-y-4">
            {/* Sticky Top Bar */}
            {selectedIds.size > 0 && (
              <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b py-2 px-4 flex items-center justify-between shadow">
                <span className="font-semibold text-sm text-gray-700 dark:text-gray-200">
                  {selectedIds.size} PNR{selectedIds.size > 1 ? "s" : ""}{" "}
                  selected
                </span>
                <div className="space-y-1 space-x-1">
                  <button
                  className="bg-teal-600 text-white px-4 py-1.5 text-sm rounded hover:bg-teal-700"
                  onClick={() => {
                    setShowUmrahGroupModal(true);
                  }}
                >
                  U Group
                </button>

                <button
                  className="bg-teal-600 text-white px-4 py-1.5 text-sm rounded hover:bg-teal-700"
                  onClick={() => {
                    setShowSellTicketModal(true);
                  }}
                >
                  Sell
                </button>
                </div>
              </div>
            )}

            {showUmrahGroupModal && selectedTickets.length > 0 && (
              <UmrahGroupModal
                selectedTickets={selectedTickets}
                umrahGroups={umrahGroups}
                setShowUmrahGroupModal={setShowUmrahGroupModal}
              />
            )}

            {showSellTicketModal && selectedTickets.length > 0 && (
              <SellTicketsModal
                selectedTickets={selectedTickets}
                setShowSellTicketModal={setShowSellTicketModal}
              />
            )}

            {/* Grouped Tickets */}
            {Object.entries(groupedTickets)
              .sort((a, b) => b[0].localeCompare(a[0])) // latest date first
              .map(([date, items]) => (
                <div key={date}>
                  <h3 className="font-semibold text-gray-600 dark:text-gray-300 mb-2">
                    {date}
                  </h3>
                  <ul className="space-y-1">
                    {items.map((ticket, index) => (
                      <React.Fragment key={ticket.id}>
                     {ticket.umrah_group_id === null && ticket.available !== 0 ? 
                     <li
                        // key={ticket.id}
                        className={`flex items-center gap-2 p-2 rounded cursor-pointer border ${
                          isSelected(ticket.id)
                            ? "bg-teal-100 hover:bg-teal-200 border-teal-400 dark:bg-teal-900 dark:border-teal-500"
                            : "hover:bg-teal-100 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => toggleSelect(ticket.id)}
                      >
                        <span className="w-5 text-sm text-gray-500">
                          {ticket.is_umrah && "U"}
                        </span>
                        <span className="w-5 text-sm text-gray-500">
                          {index + 1}.
                        </span>
                        <span className="flex-1 text-sm text-gray-800 dark:text-gray-200">
                          <span className="uppercase">{ticket.route}</span> • <strong>{ticket.pnr}</strong> - {ticket.pax} PAX ({ticket.available} Available) • ৳ {ticket.ticket_price}/{ticket.selling_price}
                        </span>
                        <span className="ml-1 flex-shrink text-sm text-gray-800 dark:text-gray-200">
                           <PencilIcon className="w-4" />
                        </span>
                      </li>
                      :
                      <li
                        // key={ticket.id}
                        className={`flex items-center gap-2 p-2 rounded cursor-pointer border bg-gray-200 dark:hover:bg-gray-800 `}
                      >
                        <span className="w-5 text-sm text-gray-500">
                          {ticket.is_umrah && "U"}
                        </span>
                        <span className="w-5 text-sm text-gray-500">
                          {index + 1}.
                        </span>
                        <span className="flex-1 text-sm text-gray-800 dark:text-gray-200">
                          <span className="uppercase">{ticket.route}</span> • <strong>{ticket.pnr}</strong> - {ticket.pax} PAX ({ticket.available} Available) • ৳ {ticket.ticket_price}/{ticket.selling_price}
                        </span>
                        <span className="ml-1 flex-shrink text-sm text-gray-800 dark:text-gray-200">
                           <PencilIcon className="w-4" />
                        </span>
                      </li>  
                    }
                      </React.Fragment>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
