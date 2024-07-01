"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavbarMobile = () => {
  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant={"ghost"} className="!p-0">
            <Image
              src={"/menu.svg"}
              height={30}
              width={30}
              alt="Mobile Navigation Toggle"
            />
          </Button>
        </SheetTrigger>
        <SheetContent
          className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800 border-none flex flex-col"
          side={"left"}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          <NavigationMenu />
          <Button variant={"secondary"}>
            {/* TODO: add func */}
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </Button>
        </SheetContent>
      </Sheet>
    </div>
  );
};
export default NavbarMobile;

function NavigationMenu() {
  const pathname = usePathname();

  return (
    <div className="flex-1 flex flex-col items-start justify-start w-full space-y-4 py-6">
      <Button
        asChild
        variant={pathname === "/settings" ? "secondary" : "ghost"}
        className="w-full"
      >
        <Link href={"/settings"}>Settings</Link>
      </Button>
      <Button
        asChild
        variant={pathname === "/server" ? "secondary" : "ghost"}
        className="w-full"
      >
        <Link href={"/server"}>Server</Link>
      </Button>
      <Button
        asChild
        variant={pathname === "/client" ? "secondary" : "ghost"}
        className="w-full"
      >
        <Link href={"/client"}>Client</Link>
      </Button>
      <Button
        asChild
        variant={pathname === "/admin" ? "secondary" : "ghost"}
        className="w-full"
      >
        <Link href={"/admin"}>Admin</Link>
      </Button>
    </div>
  );
}
