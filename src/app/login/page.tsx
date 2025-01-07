import MKLogo from "@/app/ui/mk-logo";
import LoginForm from "@/app/ui/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-6 md:-mt-32">
        <Link href="/">
          <MKLogo />
        </Link>
        <LoginForm />
      </div>
    </main>
  );
}
