import Image from "next/image";
import { fetchSystemData } from "@/app/lib/data";
import { PaintBrushIcon } from "@heroicons/react/24/outline";

const colors = [
  { id: 1, name: "Red", color: "red" },
  { id: 2, name: "Green", color: "green" },
  { id: 3, name: "Blue", color: "blue" },
];

export default async function SettingsForm() {
  const systemData = (await fetchSystemData())[0];

  return (
    <div className="mx-auto py-6 space-y-6">
      {/* General Info */}
      <section className="border rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="font-semibold text-gray-700 mb-2">System Name</h2>
          <p className="text-gray-600">{systemData?.name || "N/A"}</p>
        </div>
        <div>
          <h2 className="font-semibold text-gray-700 mb-2">
            System Description
          </h2>
          <p className="text-gray-600">{systemData?.description || "N/A"}</p>
        </div>
      </section>

      {/* Logo Preview */}
      <section className="border rounded-xl p-6">
        <h2 className="font-semibold text-gray-700 mb-4">System Logo</h2>
        <div className="flex items-center justify-center border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 h-40">
          {systemData?.logo ? (
            <Image
              src={systemData.logo}
              alt="System Logo"
              width={120}
              height={120}
              className="object-contain max-h-full"
            />
          ) : (
            <span className="text-gray-400">No logo uploaded</span>
          )}
        </div>
      </section>

      {/* Theme Color */}
      <section className="border rounded-xl p-6 bg-white">
        <h2 className="font-semibold text-gray-700 mb-4">System Theme</h2>

        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative">
            <select
              id="airline"
              name="airline"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="airline-error"
              defaultValue={systemData?.themeColor || "green"}
            >
              <option value="" disabled>
                Select color
              </option>
              {colors.map((color) => (
                <option key={color.id} value={color.color}>
                  {color.name}
                </option>
              ))}
            </select>
            <PaintBrushIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      </section>
    </div>
  );
}
