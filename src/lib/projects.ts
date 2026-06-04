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
