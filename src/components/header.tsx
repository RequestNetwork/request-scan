/** @format */
'use client';

import { usePathname } from 'next/navigation';
import { Logo } from './logo';
import { MainNav } from './main-nav';
import { Search } from './search';
import { Socials } from './socials';

export default function Header() {
  const pathname = usePathname();

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-32">
        <Logo />
        <div className="ml-auto flex items-center space-x-4 px-4">
          {pathname !== '/' && <Search />}
        </div>
        <MainNav className="mx-6" />
        <Socials />
      </div>
    </div>
  );
}
