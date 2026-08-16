import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { client } from '$services/redis';
import { userKey, usernamesUniqueKey } from '$services/keys';
import { attr } from 'svelte/internal';
// import { deserialize } from 'v8';

export const getUserByUsername = async (username: string) => {};

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
	return id;
};
const serialize = (user: CreateUserAttrs) => {
	return { userName: user.username, password: user.password };
};

const deserialize = (id: string, user: { [keys: string]: string }) => {
	return { id: id, username: user.username, password: user.password };
};
