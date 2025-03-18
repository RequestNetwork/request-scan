/** @format */

import { Logo } from "./logo";
import { MainNav } from "./main-nav";
import { Socials } from "./socials";
import VersionDisplay from "./ui/version-badge";

export function Footer() {
  return (
    <div className="flex items-end justify-between md:px-32 px-2">
      <div className="flex flex-col  md:py-5 md:gap-2 justify-items-center">
        <Logo className="mx-3" color="white" />
        <Socials color="white" />
        <MainNav className="mx-3 text-white" hoverClass="hover:text-black" />
      </div>
      <div className="flex flex-col gap-2">
        <VersionDisplay githubRelease="https://github.com/RequestNetwork/request-scan/releases" />
        <p className="text-end text-sm text-white">
          © {new Date().getFullYear()} Request Network
        </p>
      </div>
    </div>
  );
}
