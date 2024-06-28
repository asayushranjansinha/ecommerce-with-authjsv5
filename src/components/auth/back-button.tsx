"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BackButtonProps {
  href: string;
  label: string;
}
const BackButton = ({ href, label }: BackButtonProps) => {
  return (
    <Button asChild size={"sm"} variant={"link"} className="font-normal w-full">
      <Link href={href} onClick={()=>console.log("clicked on back button")}>{label}</Link>
    </Button>
  );
};
export default BackButton;
