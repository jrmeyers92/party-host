import { PartyPopper } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

export default function Hero() {
  return (
    <div className="my-16 flex flex-col items-start gap-6">
      <h2 className="text-5xl">Are you hosting a party?</h2>
      <p className="max-w-sm text-xl text-gray-600 dark:text-gray-300">
        Create a custom list for your party and let guests sign up to bring what
        you need—food, drinks, decor, and more. Your perfect gathering is just a
        few clicks away!
      </p>
      <Link href="/sign-up" className={buttonVariants({ size: "xl" })}>
        Start Planning Your Party <PartyPopper size={64} />
      </Link>
    </div>
  );
}
