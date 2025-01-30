import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/outline";
// import { deleteInvoice } from '@/app/lib/actions';

export function CreateGame() {
  return (
    <Link
      href="/dashboard/games/create"
      className="flex h-10 items-center rounded-lg bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Add Game</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

// export function UpdateGame({ id }: { id: string }) {
//   return (
//     <Link
//       href={`/dashboard/games/${id}/edit`}
//       className="rounded-md border p-2 hover:bg-gray-100"
//     >
//       <PencilIcon className="w-5" />
//     </Link>
//   );
// }

// export function DeleteGame({ id }: { id: string }) {
//   const deleteInvoiceWithId = deleteInvoice.bind(null, id);

//   return (
//     <form action={deleteInvoiceWithId}>
//       <button className="rounded-md border p-2 hover:bg-gray-100">
//         <span className="sr-only">Delete</span>
//         <TrashIcon className="w-5" />
//       </button>
//     </form>
//   );
// }
