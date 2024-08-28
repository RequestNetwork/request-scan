/** @format */

import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export function Logo({
  className,
  color = 'black',
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <Link href="/" className={cn(className)} {...props}>
      {color === 'black' ? (
        <Image
          src="logo-2.svg"
          alt="Logo"
          className="h-8"
          width="100"
          height="100"
        />
      ) : (
        <Image
          src="logo-3.svg"
          alt="Logo"
          className="h-8"
          width="100"
          height="100"
        />
      )}
    </Link>
  );
}
