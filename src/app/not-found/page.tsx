/** @format */

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="flex pt-24 justify-center">
      <Card className="flex-col justify-center items-center text-center h-[400px] w-[95%] md:h-[700px] pt-32 md:pt-52">
        <CardHeader>
          <CardTitle>Page not found</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            The page you are looking for does not exist.
          </CardDescription>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="font-medium text-emerald-700">
            <Link href="/">Back to home</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
