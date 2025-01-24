import MKLogo from "@/components/ui/mk-logo";
import SignupForm from "@/components/forms/signup-form";
import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-6 md:-mt-32">
        <Link href="/">
          <MKLogo />
        </Link>
        <SignupForm />
      </div>
    </main>
  );
}
