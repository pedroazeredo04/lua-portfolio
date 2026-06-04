import { getCategories } from '$lib/server/categories';
import { getPosts, addPost, savePosts, saveImage } from '$lib/server/posts';
import { error, redirect, fail } from '@sveltejs/kit';
import { randomUUID } from 'crypto';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const categories = await getCategories();
	const category = categories.find((c) => c.slug === params.slug);
	if (!category) error(404, 'Category not found');

	const posts = await getPosts(params.slug);
	return { category, posts };
};

export const actions: Actions = {
	upload: async ({ request, params }) => {
		const formData = await request.formData();
		const imageFile = formData.get('image') as File | null;
		const caption = formData.get('caption')?.toString().trim() ?? '';

		if (!imageFile || imageFile.size === 0) {
			return fail(400, { error: 'Please select an image.' });
		}

		const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
		if (!allowed.includes(imageFile.type)) {
			return fail(400, { error: 'Only JPEG, PNG, WebP, and GIF images are allowed.' });
		}

		if (imageFile.size > 10 * 1024 * 1024) {
			return fail(400, { error: 'Image must be under 10 MB.' });
		}

		const imagePath = await saveImage(params.slug, imageFile);
		await addPost(params.slug, {
			id: randomUUID(),
			caption,
			image: imagePath,
			createdAt: new Date().toISOString()
		});

		redirect(303, `/admin/${params.slug}`);
	},

	delete: async ({ request, params }) => {
		const formData = await request.formData();
		const postId = formData.get('id')?.toString();
		if (!postId) return fail(400, { error: 'Missing post ID.' });

		const posts = await getPosts(params.slug);
		await savePosts(params.slug, posts.filter((p) => p.id !== postId));
		redirect(303, `/admin/${params.slug}`);
	}
};
