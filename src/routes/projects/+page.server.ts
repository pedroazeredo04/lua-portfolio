import { getCategories } from '$lib/server/categories';

export async function load() {
	return { categories: await getCategories() };
}
