import { PlusIcon, SpeakerWaveIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export function SendNotification() {
  return (
    <Link
      href="#"
      className="flex h-10 items-center rounded-lg bg-teal-600 px-4 text-sm font-medium text-white transition-colors hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Notify Debtors</span>{" "}
      <SpeakerWaveIcon className="h-5 md:ml-4" />
    </Link>
  );
}