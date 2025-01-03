import { FlagIcon } from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";
import Link from "next/link";

export default function MKLogo() {
  return (
    <Link href="/">
      <div
        className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
      >
        <FlagIcon className="h-11 w-11 rotate-[-10deg]" />
        <p className="flex text-[44px]">MK Data</p>
      </div>
    </Link>
  );
}
