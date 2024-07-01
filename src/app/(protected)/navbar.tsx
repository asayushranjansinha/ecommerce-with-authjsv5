"use client";
import UserButton from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavbarMobile from "./navbar-mobile";

const Navbar = () => {
  const pathname = usePathname();
  return (
    <nav className="sticky top-0 inset-x-0 bg-secondary z-50">
      <div className="container mx-auto py-2 flex items-center justify-between">
        <div className="lg:hidden">
          <NavbarMobile />
        </div>
        <div className="" />

        {/* For larger screens */}
        <div className="hidden lg:flex gap-x-2">
          <Button asChild variant={pathname === "/" ? "default" : "link"}>
            <Link href={"/"}>Home</Link>
          </Button>
          <Button
            asChild
            variant={pathname === "/settings" ? "default" : "link"}
          >
            <Link href={"/settings"}>Settings</Link>
          </Button>
          <Button asChild variant={pathname === "/server" ? "default" : "link"}>
            <Link href={"/server"}>Server</Link>
          </Button>
          <Button asChild variant={pathname === "/client" ? "default" : "link"}>
            <Link href={"/client"}>Client</Link>
          </Button>
          <Button asChild variant={pathname === "/admin" ? "default" : "link"}>
            <Link href={"/admin"}>Admin</Link>
          </Button>
        </div>
        <UserButton />
      </div>
    </nav>
  );
};

export default Navbar;
