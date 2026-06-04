import { ADMIN_PASSWORD, SESSION_SECRET } from '$env/static/private';
import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.isAdmin) redirect(303, '/admin/categories');
	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies, locals }) => {
		if (locals.isAdmin) redirect(303, '/admin/categories');

		const data = await request.formData();
		const password = data.get('password')?.toString() ?? '';

		if (password !== ADMIN_PASSWORD) {
			return fail(401, { error: 'Wrong password' });
		}

		cookies.set('admin_session', SESSION_SECRET, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV !== 'development',
			maxAge: 60 * 60 * 24 * 30
		});

		redirect(303, '/admin/categories');
	}
};
