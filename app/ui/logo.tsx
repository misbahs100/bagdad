import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";
import Image from "next/image";

export default async function Logo() {
 
  return (
    <div
      className={`${lusitana.className} flex items-center gap-2 text-white w-full `}
    >
      {/* <PaperAirplaneIcon className="h-7 w-7 flex-shrink-0" /> */}
      <Image
      src="/user-avatar.png"
      alt="Logo"
      className="h-7 w-7 flex-shrink-0"
      width={100}
      height={100}      
      />
      <p
        className=" text-[20px] truncate w-full md:w-full"
        title="BAGDAD Travels Company Ltd."
      >
        BAGDAD Travels Company Ltd.
      </p>
    </div>
  );
}
