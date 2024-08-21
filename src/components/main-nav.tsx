/** @format */

import Link from 'next/link';

import { cn } from '@/lib/utils';

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      <Link
        href="https://request.network/"
        className="text-sm font-medium transition-colors hover:text-secondary"
        target="_blank"
      >
        Request Network
      </Link>
      <Link
        href="https://docs.request.network/"
        className="text-sm font-medium transition-colors hover:text-secondary"
        target="_blank"
      >
        Docs
      </Link>
    </nav>
  );
}
