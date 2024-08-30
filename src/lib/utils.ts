/** @format */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as timeago from 'timeago.js';
import en_short from 'timeago.js/lib/lang/en_short';
timeago.register('en_short', en_short);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const groupBy = (items: any, key: any) =>
  items.reduce((result: any, item: any) => {
    if (!result[item[key]]) {
      result[item[key]] = [];
    }
    result[item[key]].push(item);
    return result;
  }, {});

export const formatTimestamp = (timestamp: number) =>
  `${new Date(timestamp * 1000).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'UTC',
  })} UTC`;
