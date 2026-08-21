import { DateTime } from 'luxon';

export const pageCacheKey = (route: string) => `pageCache#${route}`;
export const userKey = (userId: string) => `users${userId}`;
export const sessionKey = (sessionId: string) => `sesssion#${sessionId}`;
export const usernamesUniqueKey = () => `usernames#unique`;
export const userLikesKey = (userId: string) => `users:likes#${userId}`;
export const usernamesKey = () => `username:`;

//Items
export const itemKey = (itemId: string) => `items#${itemId}`;
export const itemByViewKey = () => `items:views`;
export const itemByEndingatkey = () => 'items:endingAt';
export const bidHistoryKey = (itemid: string) => `history${itemid}`;
