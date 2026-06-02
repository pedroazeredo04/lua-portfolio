export interface Category {
	id: string;
	slug: string;
	name: string;
	description: string;
	previewImage: string | null;
	order: number;
}

// TODO: replace with fetch('/api/categories') when backend is ready
export const categories: Category[] = [
	{
		id: '1',
		slug: 'draw',
		name: 'Draw',
		description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
		previewImage: '/draw-preview.jpg',
		order: 1
	},
	{
		id: '2',
		slug: 'crochet',
		name: 'Crochet',
		description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		previewImage: '/crochet-preview.jpg',
		order: 2
	},
	{
		id: '3',
		slug: 'aesthetics',
		name: 'Aesthetics',
		description: 'Ut enim ad minim veniam, quis nostrud exercitation.',
		previewImage: '/aesthetics-preview.jpg',
		order: 3
	}
];
