import { getAbout, saveAbout } from '$lib/server/about';
import { saveImage } from '$lib/server/posts';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { about: await getAbout() };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const bio = formData.get('bio')?.toString().trim() ?? '';
		const photoFile = formData.get('photo') as File | null;

		const current = await getAbout();
		let photo = current.photo;

		if (photoFile && photoFile.size > 0) {
			photo = await saveImage('about', photoFile);
		}

		await saveAbout({ bio, photo });
		redirect(303, '/admin/about');
	}
};
