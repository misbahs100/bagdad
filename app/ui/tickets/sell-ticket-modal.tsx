import {
  Dispatch,
  SetStateAction,
  startTransition,
  useEffect,
  useState,
} from "react";
import { Button } from "../button";
import { useActionState } from "react";
import {
  PlusIcon,
  ShareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { sellTicket, SellTicketState } from "@/app/lib/actions";

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
};

interface Passenger {
  name: string;
  amount: number;
  passport_no: string;
  ticket: Ticket;
  [key: string]: string | number | Ticket;
}

export function SellTicketsModal({
  setShowSellTicketModal,
  selectedTickets,
}: {
  setShowSellTicketModal: Dispatch<SetStateAction<boolean>>;
  selectedTickets: Ticket[];
}) {
  const [isLoading, setIsLoading] = useState(false);

  const [passengers, setPassengers] = useState<Passenger[]>([
    { name: "", amount: 0, passport_no: "", ticket: selectedTickets[0] || "" },
  ]);

  const handlePassengerChange = (
    index: number,
    field: keyof Passenger,
    value: string | Ticket
  ) => {
    const newPassengers = [...passengers];
    if (field === "ticket" && typeof value === "string") {
      const matchedTicket = selectedTickets.find((t) => t.id === value);
      if (matchedTicket) {
        newPassengers[index].ticket = matchedTicket;
      }
    } else {
      newPassengers[index][field] = value;
    }
    setPassengers(newPassengers);
  };

  const addPassenger = () => {
    const defaultTicket = selectedTickets[0] || {};
    setPassengers([
      ...passengers,
      { name: "", amount: 0, passport_no: "", ticket: defaultTicket },
    ]);
  };

  const removePassenger = (index: number) => {
    setPassengers((prev) => prev.filter((_, i) => i !== index));
  };

  // form actions state and functions
  const initialState: SellTicketState = { message: null, errors: {} };
  const sellTicketWrapper = async (
    prevState: SellTicketState,
    formData: FormData
  ) => {
    return sellTicket(prevState, formData);
  };

  const [state, formAction] = useActionState<SellTicketState, FormData>(
    sellTicketWrapper,
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

  useEffect(() => {
    if (state.message) {
      const regex = /Tickets sold successfully./;
      const match = state.message.match(regex);

      if (match) {
        setTimeout(() => {
          setIsLoading(false);
          setShowSellTicketModal(false);
        }, 500);
      }
    }
  }, [state.message]);

  useEffect(() => {
    if (state.errors) {
      setShowSellTicketModal(true);
      setIsLoading(false);
    }
  }, [state.errors]);

  return (
    <>
      <div className="justify-center items-center flex fixed inset-0 z-50">
        <div className="relative w-full max-w-3xl mx-auto my-8">
          {/* content */}
          <div className="max-h-[90vh] overflow-y-auto border-0 rounded-lg shadow-lg flex flex-col bg-white outline-none">
            {/* header */}
            <div className="p-5 border-b border-solid border-slate-200 rounded-t flex justify-between">
              <div>
                <h1 className="text-lg font-semibold">Sell Ticket</h1>
                <p className="text-xs text-gray-500">
                  PNRs: {selectedTickets.map((tkt) => tkt.pnr + ", ")}
                </p>
              </div>
              <Button
                className="bg-red-400 hover:bg-red-700"
                onClick={() => setShowSellTicketModal(false)}
              >
                <XMarkIcon className="w-5 h-5" />
              </Button>
            </div>

            {/* scrollable form */}
            <div className="p-6 overflow-y-auto">
              <form className="space-y-6" onSubmit={handleFormSubmit}>
                {/* passengers info */}
                <div>
                  <div className="flex justify-between">
                    <label
                      htmlFor="products"
                      className="mb-4 block text-sm font-medium text-gray-700"
                    >
                      Passangers Info
                    </label>
                  </div>
                  {passengers.map((passenger, index) => (
                    <div
                      key={index}
                      className="mb-6 border px-1 py-4 rounded-md"
                    >
                      
                      {/* Ticket Dropdown */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Select Ticket
                        </label>
                        <select
                          value={passenger.ticket?.id || ""}
                          onChange={(e) =>
                            handlePassengerChange(
                              index,
                              "ticket",
                              e.target.value
                            )
                          }
                          className="text-xs mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                        >
                          {selectedTickets.map((ticket) => (
                            <option key={ticket.id} value={ticket.id}>
                              {ticket.route} • {ticket.pnr} • {ticket.pax} PAX (
                              {ticket.available} Available) • ৳ {ticket.ticket_price}/{ticket.selling_price}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      
                      {/* Amount */}
                      <div className="flex-1 w-full">
                          <label className="block text-sm font-medium text-gray-700">
                            Amount
                          </label>
                          <input
                            type="number"
                            value={passenger.amount}
                            onChange={(e) =>
                              handlePassengerChange(
                                index,
                                "amount",
                                e.target.value
                              )
                            }
                            max={passenger.ticket.selling_price}
                            placeholder="Enter amount"
                            className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            required
                          />
                        </div>

                        {/* Passenger Name */}
                        <div className="flex-1 w-full">
                          <label className="block text-sm font-medium text-gray-700">
                            Passenger-{index + 1} Name
                          </label>
                          <input
                            type="text"
                            value={passenger.name}
                            onChange={(e) =>
                              handlePassengerChange(
                                index,
                                "name",
                                e.target.value
                              )
                            }
                            placeholder="Enter full name"
                            className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            required
                          />
                        </div>

                        {/* Passport No */}
                        <div className="flex-1 w-full">
                          <label className="block text-sm font-medium text-gray-700">
                            Passport No
                          </label>
                          <input
                            type="text"
                            value={passenger.passport_no}
                            onChange={(e) =>
                              handlePassengerChange(
                                index,
                                "passport_no",
                                e.target.value
                              )
                            }
                            placeholder="Enter passport number"
                            className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                            required
                          />
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          className="text-red-400 hover:text-red-700 mt-6"
                          onClick={() => removePassenger(index)}
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="mb-2 flex items-center space-x-1 text-sm font-medium text-teal-500 hover:text-teal-700"
                    onClick={addPassenger}
                  >
                    <PlusIcon className="w-5 h-5" />{" "}
                    <span>Add another passenger</span>
                  </button>

                  <input
                    type="hidden"
                    name="passengers"
                    value={JSON.stringify(passengers)}
                  />
                </div>

                <div className="flex">
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
                        Wait...
                      </>
                    ) : (
                      "Sell"
                    )}
                  </Button>

                  <button
                    className="text-red-500 background-transparent uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowSellTicketModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* backdrop */}
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
