/** @format */
import { SearchArea } from '@/components/search-area';
import { StatsArea } from '@/components/stats-area';
import { RecentArea } from '@/components/recent-area';

export default function Home() {
  return (
    <>
      <SearchArea />
      <StatsArea />
      <RecentArea />
    </>
  );
}
