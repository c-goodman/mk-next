import SideNav from "@/components/ui/dashboard/sidenav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col xl:flex-row xl:overflow-hidden">
      <div className="w-full flex-none xl:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-4 xl:overflow-y-auto xl:p-2 xl:py-6">{children}</div>
    </div>
  );
}
