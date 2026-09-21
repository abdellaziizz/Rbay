import { randomBytes } from 'crypto';
import { client } from './client';
export const withLock = async (key: string, cb: () => any) => {
	//the number between each try
	const retryDelayms = 100;
	let retries = 20;
	//Generate a random value to add it to the lock key
	const token = randomBytes(6).toString('hex'); //asd21323ksldjfa
	//generate the lock key
	const lockKey = `Lock:${key}`;
	//Set up the while loop for retry mechanicm
	while (retries >= 0) {
		retries--;
		//Try the SETNX operation with the random value
		const acquired = await client.set(lockKey, token, { NX: true, PX: 2000 });
		if (!acquired) {
			//Pause and retry again
			await pause(retryDelayms);
			continue;
		}
		//successfully add the random value to the lock key
		try {
			const result = await cb();
			return result;
		} finally {
			await client.del(lockKey);
		}
		//unset the value from lock key
	}
};

const buildClientProxy = () => {};

const pause = (duration: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, duration);
	});
};
