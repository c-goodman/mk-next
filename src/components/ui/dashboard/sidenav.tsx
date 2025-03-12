import NavLinks from "@/components/ui/dashboard/nav-links";
import MKLogo from "@/components/ui/dashboard/mk-logo";
import { PowerIcon } from "@heroicons/react/24/outline";
import { signOut } from "@/auth";

export default function SideNav() {
  return (
    <div className="flex h-full w-full flex-col p-6 xl:px-2">
      <div className="mb-2">
        <MKLogo />
      </div>
      <div className="flex grow flex-row justify-between space-x-2 xl:flex-col xl:space-x-0 xl:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 xl:block"></div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 xl:flex-none xl:justify-start xl:p-2 xl:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden xl:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
