import { DateTime } from 'luxon';

export const pageCacheKey = (route: string) => `pageCache#${route}`;
export const userKey = (userId: string) => `users${userId}`;
export const sessionKey = (sessionId: string) => `sesssion#${sessionId}`;
export const itemKey = (itemId: string) => `item#${itemId}`;
export const usernamesUniqueKey = () => `usernames#unique`;
export const userLikesKey = (userId: string) => `users:likes#${userId}`;
