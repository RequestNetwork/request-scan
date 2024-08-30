/** @format */

import Link from 'next/link';

import { cn } from '@/lib/utils';

export function MainNav({
  className,
  hoverClass,
  ...props
}: React.HTMLAttributes<HTMLElement> & { hoverClass: string }) {
  return (
    <nav
      className={cn('flex items-start space-x-4 lg:space-x-6', className)}
      {...props}
    >
      <Link
        href="https://request.network/"
        className={cn('text-sm font-medium transition-colors', hoverClass)}
        target="_blank"
        rel="noopener noreferrer"
      >
        Request Network
      </Link>
      <Link
        href="https://docs.request.network/"
        className={cn('text-sm font-medium transition-colors', hoverClass)}
        target="_blank"
        rel="noopener noreferrer"
      >
        Docs
      </Link>
    </nav>
  );
}
