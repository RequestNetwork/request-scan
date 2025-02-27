/** @format */

import { SocialIcon } from "react-social-icons";

export function Socials({ color = "black" }: { color?: string }) {
  return (
    <div className="flex items-start space-x-1">
      <SocialIcon
        url="https://x.com/RequestNetwork"
        fgColor={color}
        bgColor="transparent"
        target="_blank"
        rel="noopener noreferrer"
      />
      <SocialIcon
        url="https://www.linkedin.com/company/request-network"
        fgColor={color}
        bgColor="transparent"
        target="_blank"
        rel="noopener noreferrer"
      />
      <SocialIcon
        url="https://discord.gg/FsVAR3ny3f"
        fgColor={color}
        bgColor="transparent"
        target="_blank"
        rel="noopener noreferrer"
      />
    </div>
  );
}
