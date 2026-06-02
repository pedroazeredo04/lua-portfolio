import { categories } from '$lib/projects';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const category = categories.find((c) => c.slug === params.slug);
	if (!category) error(404, 'Category not found');
	// TODO: also fetch posts for this category from backend
	return { category };
}
