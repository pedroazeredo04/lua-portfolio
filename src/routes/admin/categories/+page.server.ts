import { getCategories, addCategory, deleteCategory, slugify } from '$lib/server/categories';
import { saveImage } from '$lib/server/posts';
import { fail, redirect } from '@sveltejs/kit';
import { randomUUID } from 'crypto';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { categories: await getCategories() };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim() ?? '';
		const slugInput = formData.get('slug')?.toString().trim() ?? '';
		const description = formData.get('description')?.toString().trim() ?? '';
		const order = parseInt(formData.get('order')?.toString() ?? '99');
		const imageFile = formData.get('previewImage') as File | null;

		if (!name) return fail(400, { createError: 'Name is required.' });

		const slug = slugInput || slugify(name);
		const categories = await getCategories();

		if (categories.some((c) => c.slug === slug)) {
			return fail(400, { createError: `Slug "${slug}" is already in use.` });
		}

		let previewImage: string | null = null;
		if (imageFile && imageFile.size > 0) {
			previewImage = await saveImage('categories', imageFile);
		}

		await addCategory({ id: randomUUID(), slug, name, description, previewImage, order });
		redirect(303, '/admin/categories');
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		if (!id) return fail(400, { deleteError: 'Missing id.' });
		await deleteCategory(id);
		redirect(303, '/admin/categories');
	}
};
