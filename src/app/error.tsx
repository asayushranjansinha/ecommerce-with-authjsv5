"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { useEffect } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col space-y-6 text-center">
        <h1
          className={cn(
            "text-6xl font-semibold text-white drop-shadow-md",
            poppins.className
          )}
        >
          OOPS!!!
        </h1>
        <p className="text-white text-lg">
          An error occurred. <br /> Please try again or return to Home Page.
        </p>

        <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <Button
          variant={"link"}
          asChild
          size={"lg"}
          className="mx-auto w-fit font-bold px-3 py-2 bg-white"
        >
          <Link href="/">Return to Home Page</Link>
        </Button>
        <Button
          size={"lg"}
          className="font-bold w-fit mx-auto"
          onClick={() => reset()}
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
