import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import packageInfo from "../../../package.json";

interface VersionDisplayProps {
  githubRelease: string;
}

export default function VersionDisplay({ githubRelease }: VersionDisplayProps) {
  return (
    <div>
      <Link target="_blank" href={githubRelease}>
        <Badge variant="outline" className="text-xs font-mono text-white">
          {packageInfo.version}
        </Badge>
      </Link>
    </div>
  );
}
