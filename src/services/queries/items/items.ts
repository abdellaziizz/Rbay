import type { CreateItemAttrs } from '$services/types';
import { serialize } from '$services/queries/items/serialize';
import { client } from '$services/redis';
import { genId } from '$services/utils';
import { itemKey } from '$services/keys';
export const getItem = async (id: string) => {};

export const getItems = async (ids: string[]) => {};

export const createItem = async (attrs: CreateItemAttrs) => {
	const id = genId();
	const serialized = serialize(attrs);
	await client.hSet(itemKey(id), serialized);
};
