/** @format */

import Image from 'next/image';
import { Search } from './search';

export function SearchArea() {
  return (
    <div className="flex items-center justify-around p-2">
      <div className="flex flex-col items-start justify-start gap-3">
        <h1 className="text-2xl font-bold text-white">
          The Request Network Explorer
        </h1>
        <Search />
      </div>
      <Image src="data.svg" alt="Data" width="300" height="300" />
    </div>
  );
}
