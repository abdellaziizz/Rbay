import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { client } from '$services/redis';
import { userKey, usernamesUniqueKey, usernamesKey } from '$services/keys';
import { attr } from 'svelte/internal';
// import { deserialize } from 'v8';

export const getUserByUsername = async (username: string) => {
	//this is base 10 id
	const decimalId = await client.zScore(usernamesKey(), username);
	if (!decimalId) {
		throw new Error('User does not exist !');
	}
	//converting back to base16
	const id = decimalId.toString(16);
	const user = await client.hGetAll(userKey(id));
	return deserialize(id, user);
};

export const getUserById = async (id: string) => {
	const user = await client.hGetAll(userKey(id));
	return deserialize(id, user);
};

export const createUser = async (attrs: CreateUserAttrs) => {
	//check if the username exist or not in the set of usernames. If exist, throw error. Else, continue
	const isExist = await client.SISMEMBER(usernamesUniqueKey(), attrs.username);
	if (isExist) {
		throw new Error('UserName is already exist');
	}

	const id = genId();
	await client.hSet(userKey(id), serialize(attrs));
	await client.sAdd(usernamesUniqueKey(), attrs.username);
	await client.zAdd(usernamesKey(), { value: attrs.username, score: parseInt(id, 16) });
	return id;
};
const serialize = (user: CreateUserAttrs) => {
	return { userName: user.username, password: user.password };
};

const deserialize = (id: string, user: { [keys: string]: string }) => {
	return { id: id, username: user.username, password: user.password };
};
