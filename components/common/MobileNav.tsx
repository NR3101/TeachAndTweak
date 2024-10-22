"use client";

import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import {
  LoginLink,
  LogoutLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";

const MobileNav = ({ user }: { user: KindeUser<object> }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="md:hidden z-50 flex items-center space-x-2">
      <ModeToggle />
      <Menu
        onClick={() => setIsMenuOpen((prev) => !prev)}
        className={`size-8 text-primary cursor-pointer transition-all duration-300 ${
          isMenuOpen ? "rotate-90" : "rotate-0"
        }`}
      />

      {isMenuOpen && (
        <nav className="absolute left-0 right-0 top-16 border-b border-border shadow-lg bg-background transition-colors duration-300">
          <div className="flex flex-col p-4 space-y-2">
            <Button variant="ghost" asChild>
              <Link href="/pricing" className="w-full justify-start">
                Pricing
              </Link>
            </Button>

            {!user ? (
              <>
                <Button variant="outline" asChild>
                  <LoginLink className="w-full justify-start">Login</LoginLink>
                </Button>

                <Button asChild>
                  <RegisterLink className="w-full justify-start">
                    Sign Up
                  </RegisterLink>
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/dashboard" className="w-full justify-start">
                    Dashboard
                  </Link>
                </Button>

                <Button asChild>
                  <Link href="/create" className="w-full justify-start">
                    Create
                  </Link>
                </Button>

                <Button variant="outline" asChild>
                  <LogoutLink className="w-full justify-start">
                    Sign Out
                  </LogoutLink>
                </Button>
              </>
            )}
          </div>
        </nav>
      )}
    </div>
  );
};

export default MobileNav;
