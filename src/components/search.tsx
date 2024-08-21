/** @format */

import { Search as SearchIcon } from 'lucide-react';
import { Input } from './ui/input';

export function Search() {
  return (
    <div className="relative ml-auto flex-1 md:grow-0">
      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search by Wallet Address / Request ID / paymentReference / CID"
        className="pl-8 md:w-[100px] lg:w-[800px]"
      />
    </div>
  );
}
