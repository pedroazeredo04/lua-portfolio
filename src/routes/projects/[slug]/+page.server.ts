import { getCategories } from '$lib/server/categories';
import { getPosts } from '$lib/server/posts';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const categories = await getCategories();
	const category = categories.find((c) => c.slug === params.slug);
	if (!category) error(404, 'Category not found');

	const posts = await getPosts(params.slug);
	return { category, posts };
}
