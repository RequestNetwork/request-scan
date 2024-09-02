/** @format */

import { Logo } from './logo';
import { MainNav } from './main-nav';
import { Socials } from './socials';

export function Footer() {
  return (
    <div className="flex items-end justify-between md:px-32 px-2">
      <div className="flex flex-col  md:py-5 md:gap-2 justify-items-center">
        <Logo className="mx-3" color="white" />
        <Socials color="white" />
        <MainNav className="mx-3 text-white" hoverClass="hover:text-black" />
      </div>
      <div>
        <p className="text-end text-sm text-white">© 2024 Request Network</p>
      </div>
    </div>
  );
}
