import { getAbout } from '$lib/server/about';

export async function load() {
	return { about: await getAbout() };
}
