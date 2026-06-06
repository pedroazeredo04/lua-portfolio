import { SESSION_SECRET } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';
import { readFile } from 'fs/promises';
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'static', 'uploads');

const MIME: Record<string, string> = {
	jpg: 'image/jpeg', jpeg: 'image/jpeg',
	png: 'image/png', webp: 'image/webp', gif: 'image/gif',
};

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/uploads/')) {
		const filePath = path.join(process.cwd(), 'static', event.url.pathname);
		if (filePath.startsWith(UPLOADS_DIR)) {
			try {
				const data = await readFile(filePath);
				const ext = path.extname(filePath).slice(1).toLowerCase();
				return new Response(data, {
					headers: {
						'Content-Type': MIME[ext] ?? 'application/octet-stream',
						'Cache-Control': 'public, max-age=31536000, immutable',
					},
				});
			} catch {
				return new Response('Not found', { status: 404 });
			}
		}
	}

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
