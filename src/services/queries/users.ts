import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { client } from '$services/redis';
import { userKey } from '$services/keys';
import { attr } from 'svelte/internal';
// import { deserialize } from 'v8';

export const getUserByUsername = async (username: string) => {};

export const getUserById = async (id: string) => {
	const user = await client.hGetAll(userKey(id));
	return deserialize(id, user);
};

export const createUser = async (attrs: CreateUserAttrs) => {
	const id = genId();
	await client.hSet(userKey(id), serialize(attrs));
	return id;
};
const serialize = (user: CreateUserAttrs) => {
	return { userName: user.username, password: user.password };
};

const deserialize = (id: string, user: { [keys: string]: string }) => {
	return { id: id, username: user.username, password: user.password };
};
