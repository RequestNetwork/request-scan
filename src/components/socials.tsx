/** @format */

import { SocialIcon } from 'react-social-icons';

export function Socials() {
  return (
    <div className="flex items-center space-x-1">
      <SocialIcon
        href="https://x.com/RequestNetwork"
        url="https://x.com"
        fgColor="black"
        bgColor="transparent"
        target="_blank"
      />
      <SocialIcon
        href="https://www.linkedin.com/company/request-network"
        url="https://www.linkedin.com"
        fgColor="black"
        bgColor="transparent"
        target="_blank"
      />
      <SocialIcon
        href="https://discord.gg/FsVAR3ny3f"
        url="https://discord.com"
        fgColor="black"
        bgColor="transparent"
        target="_blank"
      />
    </div>
  );
}
