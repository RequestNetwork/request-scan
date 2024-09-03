/** @format */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function NotFoundPage() {
  return (
    <div className="h-[700px] pt-24">
      <Card className="text-center p-52">
        <CardHeader>
          <CardTitle>Page not found</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            The page you are looking for does not exist.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
