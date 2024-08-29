/** @format */
import { SearchArea } from '@/components/search-area';
import { StatsArea } from '@/components/stats-area';
import { RecentArea } from '@/components/recent-area';

export default function Home() {
  return (
    <div className="flex flex-col gap-8 py-10 md:px-32 w-full">
      <SearchArea />
      <StatsArea />
      <RecentArea />
    </div>
  );
}
