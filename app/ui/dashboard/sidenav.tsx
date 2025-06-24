import Link from "next/link";
import Logo from "@/app/ui/logo";
import { Cog6ToothIcon, PowerIcon } from "@heroicons/react/24/outline";
import { signOut } from "@/auth";
import NavLinksServer from "./nav-links-server";
import { fetchSystemData } from "@/app/lib/data";

export default async function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 overflow-auto">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-teal-600 p-4 "
        href="/"
      >
        <div className="w-full text-white">
          <Logo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2 overflow-y-auto pr-1">
        <NavLinksServer />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <Link href="/dashboard/settings">
          <button className="flex h-[48px] lg:w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-teal-100 hover:text-teal-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <Cog6ToothIcon className="w-6" />
            <div className="hidden md:block">Settings</div>
          </button>
        </Link>
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-teal-100 hover:text-teal-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>

        <code className="hidden md:flex lg:flex  grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-xs font-medium hover:bg-teal-100 hover:text-teal-600 md:flex-none md:justify-start md:p-2 md:px-3">
          Powered by{" "}
          <a
            href="https://www.prowesdit.com/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-teal-600"
          >
            ProwesdIT
          </a>
        </code>
      </div>
    </div>
  );
}
