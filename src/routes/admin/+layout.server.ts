import { getCategories } from '$lib/server/categories';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const categories = await getCategories();
	return { isAdmin: locals.isAdmin, categories };
};
