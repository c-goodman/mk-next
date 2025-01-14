import MKLogo from "@/app/ui/mk-logo";
import Link from "next/link";
import LoginFormGoogle from "../ui/login-form-google";

export default function LoginPageGoogle() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-6 md:-mt-32">
        <Link href="/">
          <MKLogo />
        </Link>
        <LoginFormGoogle />
      </div>
    </main>
  );
}
