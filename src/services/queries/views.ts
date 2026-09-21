import { client } from '$services/redis';
import { itemKey, itemByViewKey } from '$services/keys';
export const incrementView = async (itemId: string, userId: string) => {
	return client.incrementView(itemId, userId);
};
//keys need to access
//itemKey
//itemByViewKey
//arguments need to accept
//itemId
//userId
