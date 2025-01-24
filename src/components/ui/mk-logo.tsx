import { FlagIcon } from "@heroicons/react/24/outline";
import { lusitana } from "@/components/ui/fonts";
export default function MKLogo() {
  return (
    <div className="flex h-20 shrink-0 items-end rounded-lg bg-red-600 p-4 md:h-40">
      <div
        className={`${lusitana.className} flex flex-row items-start leading-none text-white`}
      >
        <FlagIcon className="h-8 w-8 rotate-[-10deg]" />
        <p className="flex text-[38px]">MK Data</p>
      </div>
    </div>
  );
}
