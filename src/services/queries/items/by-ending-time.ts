import { client } from '$services/redis';
import { itemKey, itemByEndingatkey } from '$services/keys';
import { deserialize } from './deserialize';
export const itemsByEndingTime = async (order: 'DESC' | 'ASC' = 'DESC', offset = 0, count = 10) => {
	const id = await client.zRange(itemByEndingatkey(), Date.now(), '+inf', {
		BY: 'SCORE',
		LIMIT: { offset, count }
	});
};
