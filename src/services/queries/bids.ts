import type { CreateBidAttrs, Bid } from '$services/types';
import { client, withLock } from '$services/redis';
import { bidHistoryKey } from '$services/keys';
import { DateTime } from 'luxon';
import { deserialize } from './items';
import { getItem } from './items';
import { itemKey, itemByPriceKey } from '$services/keys';
import { promises } from 'dns';
export const createBid = async (attrs: CreateBidAttrs) => {
	return withLock(attrs.itemId, async (signals: any) => {
		const item = await getItem(attrs.itemId);
		if (!item) {
			throw new Error('Item is not found');
		}
		if (item.price >= attrs.amount) {
			throw new Error('Bid is too low');
		}
		if (item.endingAt.diff(DateTime.now()).toMillis() < 0) {
			throw new Error('Item closed bidding');
		}

		const serialized = serializeHistory(attrs.amount, attrs.createdAt.toMillis());
		if (signals.expired) {
			throw new Error(`Lock is expired . can't write more data`);
		}
		return Promise.all([
			client.rPush(bidHistoryKey(attrs.itemId), serialized),
			client.hSet(itemKey(item.id), {
				bid: item.bids + 1,
				price: attrs.amount,
				highestBidUserId: attrs.userId
			}),
			client.zAdd(itemByPriceKey(), { value: item.id, score: attrs.amount })
		]);
	});
};

export const getBidHistory = async (itemId: string, offset = 0, count = 10): Promise<Bid[]> => {
	const startIndex = -1 * offset - count;
	const endIndex = -1 - offset;
	const range = await client.lRange(bidHistoryKey(itemId), startIndex, endIndex);
	return range.map((bid) => {
		return deserializeHistory(bid);
	});
};
const serializeHistory = (amount: number, createdAt: number) => {
	return `${amount}:${createdAt}`;
};

const deserializeHistory = (stored: string) => {
	const [amount, createdAt] = stored.split(':');
	return { amount: parseFloat(amount), createdAt: DateTime.fromMillis(parseInt(createdAt)) };
};
