import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const ABOUT_FILE = path.join(DATA_DIR, 'about.json');

export interface AboutData {
	bio: string;
	photo: string;
}

const SEED: AboutData = {
	bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
	photo: '/luane.jpeg'
};

export async function getAbout(): Promise<AboutData> {
	try {
		const raw = await readFile(ABOUT_FILE, 'utf-8');
		return JSON.parse(raw) as AboutData;
	} catch {
		await saveAbout(SEED);
		return { ...SEED };
	}
}

export async function saveAbout(data: AboutData): Promise<void> {
	await mkdir(DATA_DIR, { recursive: true });
	await writeFile(ABOUT_FILE, JSON.stringify(data, null, 2), 'utf-8');
}
