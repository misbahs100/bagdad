"use client";
import {
  ArrowTurnLeftDownIcon,
  CalculatorIcon,
  DocumentMagnifyingGlassIcon,
  HomeIcon,
  ShareIcon,
  TicketIcon,
  UserCircleIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  { name: "Offices", href: "/dashboard/offices", icon: ShareIcon },
  { name: "Purchase", href: "/dashboard/purchase", icon: ArrowTurnLeftDownIcon },
  { name: "Tickets", href: "/dashboard/tickets", icon: TicketIcon },
  { name: "Sales & Accounts", href: "/dashboard/sales", icon: CalculatorIcon },
  { name: "Passengers", href: "/dashboard/passengers", icon: UsersIcon },
  { name: "Users", href: "/dashboard/users", icon: UserCircleIcon },
];

export default function NavLinks({ userRole }: { userRole: string | null }) {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
         if(userRole === "manager" && link.href === "/dashboard/users") return;
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-teal-100 hover:text-teal-600 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-teal-100 text-teal-600": pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
