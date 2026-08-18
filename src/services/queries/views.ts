import { client } from '$services/redis';
import { itemKey, itemByViewKey } from '$services/keys';
export const incrementView = async (itemId: string, userId: string) => {
	return Promise.all([
		client.hIncrBy(itemKey(itemId), 'views', 1),
		client.zIncrBy(itemByViewKey(), 1, itemId)
	]);
};
