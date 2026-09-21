import { createClient, defineScript } from 'redis';
import { itemKey, itemByViewKey } from '$services/keys';

const client = createClient({
	socket: {
		host: process.env.REDIS_HOST,
		port: parseInt(process.env.REDIS_PORT)
	},
	password: process.env.REDIS_PW,
	scripts: {
		addOneAndStore: defineScript({
			NUMBER_OF_KEYS: 1,
			SCRIPT: `return redis.call("SET", KEYS[1], 1 + tonumber(ARGV[1]))`,
			transformArguments(key: string, value: number) {
				return [key, value.toString()];
			},
			transformReply(reply: any) {
				return reply;
			}
		}),
		incrementView: defineScript({
			NUMBER_OF_KEYS: 3,
			SCRIPT: `local itemByViewsKey=KEYS[1]
			local itemsKey=KEYS[2]
			local userId=ARGV[1]
			local itemId=ARGV[2]
			redis.call("HINCRBY",itemsKey,"views",1)
			redis.call("ZINCRBY,itemByViewsKey,1,itemId)
			)`,
			transformArguments(itemId: string, userId: string) {
				return [itemKey(itemId), itemByViewKey(), itemId, userId];
			},
			transformReply() {}
		})
	}
});

client.on('error', (err) => console.error(err));
client.connect();

export { client };
