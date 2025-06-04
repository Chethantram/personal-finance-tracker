import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

import { Button } from "./ui/button";
import Link from "next/link";
import { LayoutDashboard, PenBox } from "lucide-react";
import { checkUser } from "@/lib/checkUser";

const Header = async () => {
  await checkUser();
  return (
    <div className="flex fixed top-0 z-10 w-full justify-between items-center py-4 px-14 bg-gray-100 border-b-2 border-black/40">
      <Link href={"/"}>
        <h1 className="text-2xl font-bold uppercase hover:underline transition-all duration-300">
          Spend
          <span className=" text-indigo-600 hover:text-indigo-700">IQ</span>
        </h1>
      </Link>
      <div>
        <SignedOut>
          <SignInButton forceRedirectUrl="/dashboard">
            <Button variant={"outline"}>Login</Button>
          </SignInButton>
        </SignedOut>
        <div className="flex items-center gap-3">
          <SignedIn>
            <Link href={"/dashboard"}>
              <Button className="flex items-center gap-2" variant={"outline"}>
                <LayoutDashboard size={14} />
                <h4>Dashboard</h4>
              </Button>
            </Link>
            <Link href={"/transaction/create"}>
              <Button className="flex items-center gap-2">
                <PenBox size={14} />
                <h4>Transaction</h4>
              </Button>
            </Link>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10",
                  userButtonAvatarBox: "h-10 w-10",
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </div>
  );
};

export default Header;
