import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { FaBookReader } from "react-icons/fa";
import { Button } from "../ui/button";
import MobileNav from "./MobileNav";
import { ModeToggle } from "./ModeToggle";
import {
  LoginLink,
  LogoutLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const Navbar = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-colors duration-300 shadow-md">
      <MaxWidthWrapper>
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 mr-4">
            <FaBookReader className="size-8 text-primary transition-colors duration-300" />
            <span className="text-xl md:text-2xl font-bold text-primary transition-colors duration-300 whitespace-nowrap">
              Teach & Tweak
            </span>
          </Link>

          <MobileNav user={user} />

          <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <Button variant="ghost" asChild className="px-2 lg:px-4">
              <Link href="/pricing">Pricing</Link>
            </Button>

            {!user ? (
              <>
                <Button variant="outline" asChild className="px-2 lg:px-4">
                  <LoginLink>Login</LoginLink>
                </Button>

                <Button asChild className="px-2 lg:px-4">
                  <RegisterLink>Sign Up</RegisterLink>
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild className="px-2 lg:px-4">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>

                <Button asChild className="px-2 lg:px-4">
                  <Link href="/create">Create</Link>
                </Button>

                <Button variant="outline" asChild className="px-2 lg:px-4">
                  <LogoutLink>Sign out</LogoutLink>
                </Button>
              </>
            )}

            <ModeToggle />
          </nav>
        </div>
      </MaxWidthWrapper>
    </header>
  );
};

export default Navbar;
