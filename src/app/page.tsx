/** @format */
import { SearchArea } from '@/components/search-area';
import { StatsArea } from '@/components/stats-area';
import { RecentArea } from '@/components/recent-area';

export default function Home() {
  return (
    <div className="grid">
      <div className="col-start-1 row-start-1 bg-primary md:h-96"></div>
      <div className="col-start-1 row-start-1">
        <div className="flex flex-1 flex-col md:gap-8 md:p-8">
          <SearchArea />
          <StatsArea />
          <RecentArea />
        </div>
      </div>
    </div>
  );
}
