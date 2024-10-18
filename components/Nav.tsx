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
    <nav className="flex items-center gap-4 justify-between w-full max-w-2xl px-4">
      <Link href={"/"}>Party Host</Link>
      Hey, {user.email}!
      <form action={signOutAction}>
        <Button type="submit" variant={"outline"}>
          Sign out
        </Button>
      </form>
    </nav>
  ) : (
    <nav className="flex gap-2 items-center justify-between max-w-2xl w-full px-4">
      <Link href={"/"}>Party Host</Link>
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
  );
}
