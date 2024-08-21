/** @format */

import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/">
      <Image
        src="logo-2.svg"
        alt="Logo"
        className="h-8"
        width="100"
        height="100"
      />
    </Link>
  );
}
