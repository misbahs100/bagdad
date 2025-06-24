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
  ShareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  makeUmrahGroup,
  UmrahGroupState,
} from "@/app/lib/actions";

type Ticket = {
  id: string;
  purchase_date: string;
  airline: string;
  route: string;
  pnr: string;
  pax: number;
  ticket_price: number;
  sold?: boolean;
  available: number;
};

interface Group {
  month: string;
  id: string;
  name: string;
  created_at: string;
  pnr_list: string[];
  created_by: string;
}


export function UmrahGroupModal({
  setShowUmrahGroupModal,
  selectedTickets,
  umrahGroups,
}: {
  setShowUmrahGroupModal: Dispatch<SetStateAction<boolean>>;
  selectedTickets: Ticket[];
  umrahGroups: Group[];
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [existingGroups, setExistingGroups] =
    useState<Group[]>(umrahGroups);
  const [groupType, setGroupType] = useState<"existing" | "new">("new");
  const [groupName, setGroupName] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedGroupName, setSelectedGroupName] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [groupMonth, setGroupMonth] = useState("");
  const [previewGroupName, setPreviewGroupName] = useState("");
  useEffect(() => {
    if (groupType === "new" && groupMonth) {
      const monthPrefix = new Date(groupMonth)
        .toLocaleString("default", {
          month: "short",
          year: "2-digit",
        })
        .toLowerCase()
        .replace(" ", "");

      const count = existingGroups.filter((g) => g.month === groupMonth).length;

      const newName = `${monthPrefix}-g${count + 1}`;
      setPreviewGroupName(newName);
    }
  }, [groupMonth, existingGroups, groupType]);

  // form actions state and functions
  const initialState: UmrahGroupState = { status: null, message: null, errors: {} };
  const sellTicketWrapper = async (
    prevState: UmrahGroupState,
    formData: FormData
  ) => {
    return makeUmrahGroup(prevState, formData);
  };

  const [state, formAction] = useActionState<UmrahGroupState, FormData>(
    sellTicketWrapper,
    initialState
  );

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    console.log("submitting");
    event.preventDefault();
    setIsLoading(true);
    startTransition(() => {
      const formData = new FormData(event.currentTarget);
      formAction(formData);
    });
  };

  useEffect(() => {
  if (state.status === "success") {
    console.log("success")
    setIsLoading(false);
    const timeout = setTimeout(() => {
      setShowUmrahGroupModal(false);
    }, 500);
    return () => clearTimeout(timeout);
  }
}, [state.status]);


  useEffect(() => {
    if (state.errors) {
      setShowUmrahGroupModal(true);
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
                <h1 className="text-lg font-semibold">Make Umrah Group</h1>
                <p className="text-xs text-gray-500 truncate max-w-[90%]">
                    PNRs: {selectedTickets.map((tkt) => tkt.pnr).join(", ")}
                </p>
              </div>
              <Button
                className="bg-red-400 hover:bg-red-700"
                onClick={() => setShowUmrahGroupModal(false)}
              >
                <XMarkIcon className="w-5 h-5" />
              </Button>
            </div>

            {/* scrollable form */}
            <div className="p-6 overflow-y-auto">
              <form className="space-y-6" onSubmit={handleFormSubmit}>
                {/* group type */}
                <div className="mb-4">
                  <label
                    htmlFor="group_type"
                    className="mb-2 block text-sm font-medium"
                  >
                    Group Type
                  </label>

                  <div className="relative">
                    <select
                      id="group_type"
                      name="group_type"
                      className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                      value={groupType}
                      onChange={(e) =>
                        setGroupType(e.target.value as "new" | "existing")
                      }
                    >
                      <option value="new">Create New Group</option>
                      <option value="existing">Select Existing Group</option>
                    </select>
                    <ShareIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                  </div>
                </div>

                {groupType === "new" ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Month for Group
                      </label>
                      <input
                        type="month"
                        name="group_month"
                        value={groupMonth}
                        onChange={(e) => setGroupMonth(e.target.value)}
                        required
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>

                    {groupMonth && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Group Name (auto-generated)
                        </label>
                        <input
                          type="text"
                          name="group_name"
                          value={previewGroupName}
                          readOnly
                          className="w-full border rounded px-3 py-2 bg-gray-100"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mb-4">
                    <label
                      htmlFor="route"
                      className="mb-2 block text-sm font-medium"
                    >
                      Select Existing Group
                    </label>

                    <div className="relative">
                      <select
                        value={selectedGroupName || ""}
                        onChange={(e) => setSelectedGroupName(e.target.value)}
                        className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                        required
                        name="group_name"
                      >
                        <option value="" disabled>
                          -- Select a group --
                        </option>
                        {existingGroups.map((group) => (
                          <option key={group.id} value={group.name} className="uppercase">
                            {group.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="hidden"
                        name="group_month"
                        value={
                          existingGroups.find(g => g.name === selectedGroupName)?.month || ""
                        }
                      />
                      <input
                        type="hidden"
                        name="group_id"
                        value={
                          existingGroups.find(g => g.name === selectedGroupName)?.id || ""
                        }
                      />
                      <ShareIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                    
                  </div>
                )}
            


                <div>
                  <p className="text-sm text-gray-600 mb-2">Selected PNRs:</p>
                  <ul className="text-sm list-disc list-inside text-gray-800">
                    {selectedTickets.map((ticket) => (
                      <li key={ticket.id}>
                        {ticket.route} - <strong>{ticket.pnr}</strong>
                        <input
                          type="hidden"
                          name="ticketIds" // ← same name for all hidden inputs to form an array
                          value={ticket.id} // ← make sure to send the ID, not PNR
                        />
                      </li>
                    ))}
                  </ul>
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
                        Assigning. Wait...
                      </>
                    ) : (
                      "Make Group"
                    )}
                  </Button>

                  <button
                    className="text-red-500 background-transparent uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowUmrahGroupModal(false)}
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
