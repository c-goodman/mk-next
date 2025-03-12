import MKLogo from "@/components/ui/dashboard/mk-logo";
import Link from "next/link";
import { SignupFormProvider } from "@/components/forms/signup-form-provider";

export default function SignupPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-6 md:-mt-32">
        <Link href="/">
          <MKLogo />
        </Link>
        <SignupFormProvider />
      </div>
    </main>
  );
}
