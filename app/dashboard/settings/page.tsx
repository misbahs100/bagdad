import { lusitana } from "@/app/ui/fonts";
import { BranchesTableSkeleton, PaginationSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { Metadata } from "next";
import SettingsForm from "@/app/ui/settings/settings-form";
import { fetchSystemData } from "@/app/lib/data";


export const metadata: Metadata = {
  title: "Settings",
};

export default async function Page() {
  


  return (
    <div className="w-full">
      {/* <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>System Settings</h1>
      </div> */}
      <Suspense  fallback={<BranchesTableSkeleton />}>
        <SettingsForm />
      </Suspense>

    </div>
  );
}
