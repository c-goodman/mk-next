import Breadcrumbs from "@/components/ui/invoices/breadcrumbs";
import CreateGameForm from "@/components/forms/create-game-form";

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Games", href: "/dashboard/games" },
          {
            label: "Add Game",
            href: "/dashboard/games/create",
            active: true,
          },
        ]}
      />
      <CreateGameForm />
    </main>
  );
}
