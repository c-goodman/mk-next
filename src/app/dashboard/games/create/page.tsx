import Breadcrumbs from "@/components/ui/invoices/breadcrumbs";
import { CreateGameFormProvider } from "@/components/forms/create-game-form-provider";

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
      <CreateGameFormProvider />
    </main>
  );
}
