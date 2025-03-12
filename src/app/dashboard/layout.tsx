import SideNav from "@/components/ui/dashboard/sidenav";

export const experimental_ppr = true;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col xl:flex-row xl:overflow-hidden">
      <div className="w-full flex-none xl:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 xl:overflow-y-auto xl:p-12">{children}</div>
    </div>
  );
}
