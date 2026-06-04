import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import type { Category } from '$lib/projects';

const DATA_DIR = path.join(process.cwd(), 'data');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');

const SEED: Category[] = [
	{
		id: '1',
		slug: 'draw',
		name: 'Draw',
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
		previewImage: '/draw-preview.jpeg',
		order: 1
	},
	{
		id: '2',
		slug: 'crochet',
		name: 'Crochet',
		description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		previewImage: '/crochet-preview.jpeg',
		order: 2
	},
	{
		id: '3',
		slug: 'pictures',
		name: 'Pictures',
		description: 'Ut enim ad minim veniam, quis nostrud exercitation.',
		previewImage: '/pictures-preview.jpeg',
		order: 3
	}
];

export function slugify(name: string): string {
	return name
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '-')
		.replace(/[^a-z0-9-]/g, '');
}

export async function getCategories(): Promise<Category[]> {
	try {
		const data = await readFile(CATEGORIES_FILE, 'utf-8');
		const cats = JSON.parse(data) as Category[];
		return cats.sort((a, b) => a.order - b.order);
	} catch {
		await saveCategories(SEED);
		return [...SEED].sort((a, b) => a.order - b.order);
	}
}

export async function saveCategories(categories: Category[]): Promise<void> {
	await mkdir(DATA_DIR, { recursive: true });
	await writeFile(CATEGORIES_FILE, JSON.stringify(categories, null, 2), 'utf-8');
}

export async function addCategory(cat: Category): Promise<void> {
	const cats = await getCategories();
	cats.push(cat);
	await saveCategories(cats);
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<void> {
	const cats = await getCategories();
	await saveCategories(cats.map((c) => (c.id === id ? { ...c, ...updates } : c)));
}

export async function deleteCategory(id: string): Promise<void> {
	const cats = await getCategories();
	await saveCategories(cats.filter((c) => c.id !== id));
}
