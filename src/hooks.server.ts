import { SESSION_SECRET } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const session = event.cookies.get('admin_session');
	event.locals.isAdmin = session === SESSION_SECRET;

	const p = event.url.pathname;
	if (
		p.startsWith('/admin') &&
		p !== '/admin' &&
		p !== '/admin/logout' &&
		!event.locals.isAdmin
	) {
		redirect(303, '/admin');
	}

	return resolve(event);
};
