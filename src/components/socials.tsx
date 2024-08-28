/** @format */

import { SocialIcon } from 'react-social-icons';

export function Socials({ color = 'black' }: { color?: string }) {
  return (
    <div className="flex items-start space-x-1">
      <SocialIcon
        href="https://x.com/RequestNetwork"
        url="https://x.com"
        fgColor={color}
        bgColor="transparent"
        target="_blank"
      />
      <SocialIcon
        href="https://www.linkedin.com/company/request-network"
        url="https://www.linkedin.com"
        fgColor={color}
        bgColor="transparent"
        target="_blank"
      />
      <SocialIcon
        href="https://discord.gg/FsVAR3ny3f"
        url="https://discord.com"
        fgColor={color}
        bgColor="transparent"
        target="_blank"
      />
    </div>
  );
}
