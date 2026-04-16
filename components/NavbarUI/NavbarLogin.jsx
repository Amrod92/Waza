"use client";

import { LogIn } from "lucide-react";

import { betterAuthClient } from "../../lib/better-auth-client";
import { Button } from "../UI/button";
import Link from "next/link";

const NavbarLogin = () => {
  return (
    <Link href="/auth/signin" className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        className="rounded-full border-[#d9cdbf] bg-white/75 px-4 text-[#3d2b1f] shadow-sm hover:bg-white hover:shadow-md"
      >
        <LogIn className="h-4 w-4" />
        <span className="hidden sm:inline">Sign in</span>
      </Button>
    </Link>
  );
};

export default NavbarLogin;
