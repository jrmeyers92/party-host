import { signOutAction } from "@/app/actions";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ThemeSwitcher } from "./theme-switcher";
import { Button } from "./ui/button";

export default async function Nav() {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  return user ? (
    <header className="flex w-full items-center justify-center border-b py-8">
      <nav className="flex w-full items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-2">
          <Link href={"/"} className="mr-8 text-2xl font-bold">
            Wat Can I Bring?
          </Link>
          <Link href="/events" className="text-lg hover:underline">
            My Events
          </Link>
          <Link href="/events/create" className="text-lg hover:underline">
            Create Event
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <form action={signOutAction}>
            <Button type="submit" variant={"outline"}>
              Sign out
            </Button>
          </form>
        </div>
      </nav>
    </header>
  ) : (
    <header className="my-8 flex w-full items-center justify-center">
      <nav className="flex w-full max-w-2xl items-center justify-between gap-2 px-4">
        <Link href={"/"} className="text-2xl font-bold">
          Party Host
        </Link>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <Button asChild size="sm" variant={"outline"}>
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild size="sm" variant={"default"}>
            <Link href="/sign-up">Sign up</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
