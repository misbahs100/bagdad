'use client';
import { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

type Sale = {
  id: string;
  sold_by: string;
  date: string;
  passenger_count: number;
  pnr_list: {
    id: string;
    airline: string;
    route: string;
    pnr: string;
    pax: number;
    purchase_date: string;
    ticket_price: number;
    selling_price: number;
    available: number;
    is_umrah: boolean;
  }[];
  passenger_list: {
    id: string;
    name: string;
    passport_no: string;
    due_amount: number;
  }[];
};

export default function SalesList({ sales }: { sales: Sale[] }) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const toggleOpen = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      {sales.map((sale) => {
        const isOpen = openIds.has(sale.id);
        return (
          <div key={sale.id} className="rounded border shadow bg-white dark:bg-gray-900">
            <div
              className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => toggleOpen(sale.id)}
            >
              <div className="text-sm text-gray-700 dark:text-gray-200 space-y-1">
                <div><span className="font-medium">Sold By:</span> {sale.sold_by}</div>
                <div><span className="font-medium">Date:</span> {new Date(sale.date).toLocaleString()}</div>
                <div><span className="font-medium">Passengers:</span> {sale.passenger_count}</div>
              </div>
              {isOpen ? (
                <ChevronDownIcon className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRightIcon className="w-5 h-5 text-gray-500" />
              )}
            </div>

            {isOpen && (
              <div className="border-t px-4 py-3 space-y-4 bg-gray-50 dark:bg-gray-800">
                {/* Passengers */}
                <div>
                  <h4 className="font-semibold text-sm text-teal-600 dark:text-teal-400 mb-1">Passengers</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-0.5">
                    {sale.passenger_list.map((p) => (
                      <li key={p.id} className='flex items-center'>{p.name} (<DocumentTextIcon className='w-3 h-3' /> {p.passport_no}) {p.due_amount > 0 && <span className='text-red-500 ml-1'>Due: ৳ {p.due_amount}</span>}</li>
                    ))}
                  </ul>
                </div>

                {/* Tickets */}
                <div>
                  <h4 className="font-semibold text-sm text-teal-600 dark:text-teal-400 mb-1">PNR Information</h4>
                  <ul className="space-y-2">
                    {sale.pnr_list.map((pnr) => (
                      <li key={pnr.id} className="p-2 rounded bg-white border shadow-sm dark:bg-gray-900">
                        <div className="text-sm text-gray-800 dark:text-gray-200">
                          <strong>{pnr.pnr}</strong> – {pnr.airline.replace(/_/g, ' ')} • {pnr.route.toUpperCase()}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {pnr.pax} PAX, ${pnr.ticket_price}/${pnr.selling_price}, Available: {pnr.available}, Umrah: {pnr.is_umrah ? 'Yes' : 'No'}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
