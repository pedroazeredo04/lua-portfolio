import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const ABOUT_FILE = path.join(DATA_DIR, 'about.json');

export interface AboutData {
	bio: string;
	photo: string;
}

const SEED: AboutData = {
	bio: 'My name is Luane Catarina. I like to draw.',
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
