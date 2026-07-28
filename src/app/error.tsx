/** @format */
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex pt-24 justify-center">
      <Card className="flex-col justify-center items-center text-center h-[400px] w-[95%] md:h-[700px] pt-32 md:pt-52">
        <CardHeader>
          <CardTitle>Something went wrong</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            An unexpected error occurred while loading this page.
            {error.digest && (
              <span className="block mt-2 text-xs">
                Reference: {error.digest}
              </span>
            )}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <button
            type="button"
            onClick={() => reset()}
            className="font-medium text-emerald-700"
          >
            Try again
          </button>
          <div className="font-medium text-emerald-700">
            <Link href="/">Back to home</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
