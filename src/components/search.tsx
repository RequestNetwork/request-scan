/** @format */

import { Search as SearchIcon } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

export function Search() {
  return (
    <div className="relative ml-auto flex-1 md:grow-0 w-full">
      {/* TODO: add / paymentReference / CID */}
      <Input
        type="search"
        placeholder="Search by Wallet Address / Request ID"
        className="pl-8 md:w-[400px] lg:w-[800px] h-12 w-full"
      />
      <Button className="absolute right-2.5 top-1" size="icon">
        <SearchIcon size="20" />
      </Button>
    </div>
  );
}
