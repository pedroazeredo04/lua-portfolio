import { categories } from '$lib/projects';

export async function load() {
	// TODO: replace with fetch('/api/categories') when backend is ready
	return { categories };
}
