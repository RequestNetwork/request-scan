/** @format */

import Image from 'next/image';
import { Search } from './search';

export function SearchArea() {
  return (
    <div className="flex items-center lg:justify-between justify-center p-2">
      <div className="flex flex-col items-center justify-center md:items-start md:justify-start gap-3">
        <h1 className="text-2xl font-bold text-white">
          The Request Network Explorer
        </h1>
        <Search />
      </div>
      <Image
        className="hidden md:flex"
        src="data.svg"
        alt="Data"
        width="300"
        height="300"
      />
    </div>
  );
}
