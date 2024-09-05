/** @format */
'use client';

import { Search as SearchIcon } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAddress } from 'viem';

export function Search() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery === '' || searchQuery.length < 3) return;
    if (isAddress(searchQuery)) {
      router.push(`/address/${searchQuery}`);
    } else {
      const re = /[0-9A-Fa-f]{66}/g;
      if (re.test(searchQuery)) {
        router.push(`/request/${searchQuery}`);
      } else {
        router.push(`/not-found`);
      }
    }
  };

  const handleKeyPress = (event: { key: string }) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative ml-auto flex-1 md:grow-0 w-full">
      <Input
        type="search"
        placeholder="Search by Wallet Address / Request ID"
        className="pl-8 md:w-[300px] lg:w-[600px] xl:w-[700px] 2xl:w-[800px] h-12 w-full"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <Button
        className="absolute right-2.5 md:right-8 xl:right-2.5 top-1"
        size="icon"
        onClick={handleSearch}
      >
        <SearchIcon size="20" />
      </Button>
    </div>
  );
}
