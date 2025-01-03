import Logo from "@/app/ui/mk-logo";
import LoginForm from "@/app/ui/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 shrink-0 items-end rounded-lg bg-red-600 p-4 md:h-40">
          <div className="text-white">
            <Link href="/">
              <Logo />
            </Link>
          </div>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
