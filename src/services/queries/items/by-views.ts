import { client } from '$services/redis';
import { itemKey, itemByViewKey } from '$services/keys';
export const itemsByViews = async (order: 'DESC' | 'ASC' = 'DESC', offset = 0, count = 10) => {
	await client.sort(itemByViewKey(), {
		GET: ['#', `${itemKey('*')}->name`, `${itemKey('*')}->views`],
		BY: 'score'
	});
};
