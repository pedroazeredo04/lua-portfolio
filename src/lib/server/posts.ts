import { readFile, writeFile, mkdir, rename } from 'fs/promises';
import path from 'path';

const POSTS_DIR = path.join(process.cwd(), 'data', 'posts');
const STATIC_DIR = path.join(process.cwd(), 'static');

export interface Post {
	id: string;
	caption: string;
	image: string;
	createdAt: string;
}

export async function getPosts(slug: string): Promise<Post[]> {
	try {
		const data = await readFile(path.join(POSTS_DIR, `${slug}.json`), 'utf-8');
		return JSON.parse(data) as Post[];
	} catch {
		return [];
	}
}

export async function savePosts(slug: string, posts: Post[]): Promise<void> {
	await mkdir(POSTS_DIR, { recursive: true });
	await writeFile(path.join(POSTS_DIR, `${slug}.json`), JSON.stringify(posts, null, 2), 'utf-8');
}

export async function addPost(slug: string, post: Post): Promise<void> {
	const posts = await getPosts(slug);
	posts.push(post);
	await savePosts(slug, posts);
}

export async function renamePostsFile(oldSlug: string, newSlug: string): Promise<void> {
	const oldPath = path.join(POSTS_DIR, `${oldSlug}.json`);
	const newPath = path.join(POSTS_DIR, `${newSlug}.json`);
	try {
		await rename(oldPath, newPath);
	} catch {
		// no posts file yet — nothing to rename
	}
}

export async function saveImage(subdir: string, file: File): Promise<string> {
	const uploadDir = path.join(STATIC_DIR, 'uploads', subdir);
	await mkdir(uploadDir, { recursive: true });
	const ext = path.extname(file.name) || '.jpg';
	const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
	const bytes = await file.arrayBuffer();
	await writeFile(path.join(uploadDir, filename), Buffer.from(bytes));
	return `/uploads/${subdir}/${filename}`;
}
