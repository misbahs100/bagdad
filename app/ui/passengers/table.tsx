"use client";
import React, { useState } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

type Passenger = {
  id: string;
  name: string;
  passport_no: string;
  route: string;
  due_amount: number;
  created_at: string;
  sold_by: string;
  ticket_id: string;
  pnr_info: {
    pnr: string;
    airline: string;
    route: string;
    ticket_price: number;
    selling_price: number;
    available: number;
    purchase_date: string;
  };
  sale_info?: {
    sale_id: string;
    sold_by: string;
    date: string;
  };
};

type Props = {
  passengers: Passenger[];
};

export default function PassengersTable({ passengers }: Props) {
  const [openRows, setOpenRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const updated = new Set(openRows);
    updated.has(id) ? updated.delete(id) : updated.add(id);
    setOpenRows(updated);
  };

  return (
    <div className="mt-6 overflow-x-auto rounded-lg border bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
        <thead className="bg-gray-100  text-gray-700 ">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Passport</th>
            <th className="px-4 py-3">Route</th>
            <th className="px-4 py-3">PNR</th>
            <th className="px-4 py-3">Airline</th>
            <th className="px-4 py-3">Sold By</th>
            <th className="px-4 py-3">Due (BDT)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 ">
          {passengers.map((p) => (
            <React.Fragment key={p.id}>
              <tr  className="hover:bg-gray-50 ">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3">{p.passport_no}</td>
                <td className="px-4 py-3 uppercase">{p.route}</td>
                <td className="px-4 py-3 font-mono flex">
                    {p.pnr_info?.pnr} 
                    <button
                    onClick={() => toggleRow(p.id)}
                    className="text-gray-500 hover:text-blue-600 transition"
                    title="View Details"
                  >
                    {openRows.has(p.id) ? (
                      <ChevronDownIcon className="h-4 w-4" />
                    ) : (
                      <ChevronRightIcon className="h-4 w-4" />
                    )}
                  </button></td>
                <td className="px-4 py-3 capitalize">{p.pnr_info?.airline}</td>
                <td className="px-4 py-3">{p.sold_by}</td>
                <td className={`px-4 py-3 text-right ${p.due_amount > 0 && "text-red-600"} font-semibold`}>
                  {p.due_amount || 0}
                </td>
              </tr>

              {/* Expanded Row */}
              {openRows.has(p.id) && (
                <tr className="bg-gray-50  text-gray-700 ">
                  <td colSpan={8} className="px-6 pb-4 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Ticket Price</p>
                        <p className="font-medium">৳ {p.pnr_info?.ticket_price}/{p.pnr_info?.selling_price}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Current Available Seats</p>
                        <p className="font-medium">{p.pnr_info?.available}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Purchase Date</p>
                        <p className="font-medium">
                          {p.pnr_info?.purchase_date || "N/A"}
                        </p>
                      </div>
                      {p.sale_info && (
                        <>
                          <div>
                            <p className="text-gray-500">Sale Date</p>
                            <p className="font-medium">
                              {new Date(p.sale_info.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Sale ID</p>
                            <p className="font-mono text-xs">{p.sale_info.sale_id}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
