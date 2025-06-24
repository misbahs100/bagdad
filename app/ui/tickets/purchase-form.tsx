"use client";

import Link from "next/link";
import {
  CalendarIcon,
  CurrencyBangladeshiIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  PhoneIcon,
  ShareIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/button";
import {
  OfficeState,
  PurchaseTicketState,
  createOffice,
  purchaseTicket,
} from "@/app/lib/actions";
import { startTransition, useActionState, useEffect, useState } from "react";

export default function PurchaseTicketForm() {
  const [isLoading, setIsLoading] = useState(false);
  const initialState: PurchaseTicketState = {
    message: null,
    errors: {},
    values: {},
  };
  const [state, formAction] = useActionState<PurchaseTicketState, FormData>(
    purchaseTicket,
    initialState
  );

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    startTransition(() => {
      const formData = new FormData(event.currentTarget);
      formAction(formData);
    });
  };

  // state.errors
  useEffect(() => {
    if (state.errors) {
      setIsLoading(false);
    }
  }, [state.errors]);

  // state.message
  useEffect(() => {
    if (state.message === "Tickets purchased successfully.") {
      window.location.href = "/dashboard/purchase"; // Redirect on the client side
    } else if (state.message !== null) {
      console.error(state.message);
    }
  }, [state.message]);

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="flex flex-wrap lg:flex-nowrap gap-2">
          {/* purchase date */}
          <div className="mb-4">
            <label
              htmlFor="purchase_date"
              className="mb-2 block text-sm font-medium"
            >
              Select Date
            </label>

            <div className="relative">
              <input
                type="date"
                id="purchase_date"
                name="purchase_date"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="purchase_date-error"
                defaultValue={new Date().toISOString().split("T")[0]}
              />
              <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Airline Name */}
          <div className="mb-4">
            <label htmlFor="airline" className="mb-2 block text-sm font-medium">
              Airline
            </label>

            <div className="relative">
              <select
                id="airline"
                name="airline"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="airline-error"
                defaultValue={state?.values?.airline ?? ""}
              >
                <option value="" disabled>
                  Select airline
                </option>
                <option value="air_astra">Air Astra</option>
                <option value="biman_bangladesh">Biman Bangladesh</option>
                <option value="novoair">Novoair</option>
              </select>
              <ShareIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            {state.errors?.airline && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.airline}
              </p>
            )}
          </div>

          {/* Route */}
          <div className="mb-4">
            <label htmlFor="route" className="mb-2 block text-sm font-medium">
              Choose Route
            </label>

            <div className="relative">
              <select
                id="route"
                name="route"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="route-error"
                defaultValue={state?.values?.route ?? ""}
              >
                <option value="" disabled>
                  Select route
                </option>
                <option value="ctg-doh">ctg-doh</option>
                <option value="ctg-jed">ctg-jed</option>
              </select>
              <ShareIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
            {state.errors?.route && (
              <p className="text-red-500 text-sm mt-1">{state.errors.route}</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap lg:flex-nowrap gap-2">
          {/* PNR */}
          <div className="mb-4">
            <label htmlFor="pnr" className="mb-2 block text-sm font-medium">
              PNR
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="pnr"
                  name="pnr"
                  type="text"
                  placeholder="pnr code"
                  defaultValue={state?.values?.pnr ?? ""}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  // required
                />
                <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            {state.errors?.pnr && (
              <p className="text-red-500 text-sm mt-1">{state.errors.pnr}</p>
            )}
          </div>

          {/* PAX */}
          <div className="mb-4">
            <label htmlFor="pax" className="mb-2 block text-sm font-medium">
              PAX
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="pax"
                  name="pax"
                  type="number"
                  placeholder="total passenger"
                  defaultValue={state?.values?.pax ?? ""}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  // required
                />
                <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            {state.errors?.pax && (
              <p className="text-red-500 text-sm mt-1">{state.errors.pax}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap lg:flex-nowrap gap-2">
          {/* buying price */}
          <div className="mb-4">
            <label
              htmlFor="ticket_price"
              className="mb-2 block text-sm font-medium"
            >
              Ticket Price
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="ticket_price"
                  name="ticket_price"
                  type="number"
                  placeholder="one ticket price"
                  defaultValue={state?.values?.ticket_price ?? ""}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  // required
                />
                <CurrencyBangladeshiIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            {state.errors?.ticket_price && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.ticket_price}
              </p>
            )}
          </div>

          {/* selling price */}
          <div className="mb-4">
            <label
              htmlFor="selling_price"
              className="mb-2 block text-sm font-medium"
            >
              Selling Price
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="selling_price"
                  name="selling_price"
                  type="number"
                  placeholder="Sell price"
                  defaultValue={state?.values?.selling_price ?? ""}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                  // required
                />
                <CurrencyBangladeshiIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            {state.errors?.selling_price && (
              <p className="text-red-500 text-sm mt-1">
                {state.errors.selling_price}
              </p>
            )}
          </div>

          {/* umrah/hajj or not */}
          <div className="mb-4">
            <label
              htmlFor="is_umrah"
              className="mb-2 block text-sm font-medium"
            >
              Is this for Umrah/Hajj?
            </label>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_umrah"
                name="is_umrah"
                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                defaultChecked={state?.values?.is_umrah ?? false}
              />
              <label htmlFor="is_umrah" className="ml-2 text-sm text-gray-600">
                Yes
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/offices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-4 w-4 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              purchasing ticket...
            </>
          ) : (
            "Purchase Tickets"
          )}
        </Button>
      </div>
    </form>
  );
}
