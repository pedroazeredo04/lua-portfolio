import { getCategories, updateCategory } from '$lib/server/categories';
import { saveImage } from '$lib/server/posts';
import { error, redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const categories = await getCategories();
	const category = categories.find((c) => c.id === params.id);
	if (!category) error(404, 'Category not found');
	return { category };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim() ?? '';
		const description = formData.get('description')?.toString().trim() ?? '';
		const order = parseInt(formData.get('order')?.toString() ?? '99');
		const imageFile = formData.get('previewImage') as File | null;

		if (!name) return fail(400, { error: 'Name is required.' });

		const updates: Record<string, unknown> = { name, description, order };

		if (imageFile && imageFile.size > 0) {
			updates.previewImage = await saveImage('categories', imageFile);
		}

		await updateCategory(params.id, updates);
		redirect(303, '/admin/categories');
	}
};
