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

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex pt-24 justify-center">
          <Card className="flex-col justify-center items-center text-center h-[400px] w-[95%] md:h-[700px] pt-32 md:pt-52">
            <CardHeader>
              <CardTitle>Something went wrong</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                A critical error occurred. Please reload the page.
                {error.digest && (
                  <span className="block mt-2 text-xs">
                    Reference: {error.digest}
                  </span>
                )}
              </CardDescription>
            </CardContent>
            <CardFooter className="flex justify-center">
              <button
                type="button"
                onClick={() => reset()}
                className="font-medium text-emerald-700"
              >
                Reload
              </button>
            </CardFooter>
          </Card>
        </div>
      </body>
    </html>
  );
}
