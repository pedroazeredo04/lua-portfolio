<script lang="ts">
	import type { LayoutData } from './$types';
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	const currentPath = $derived(page.url.pathname);
</script>

<div class="min-h-screen px-6 py-4">
	{#if data.isAdmin}
		<div
			class="mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm backdrop-blur-sm"
		>
			<span class="mr-1 text-xs font-medium tracking-widest text-white/30 uppercase">Admin</span>
			{#each data.categories as cat}
				<a
					href="/admin/{cat.slug}"
					class="rounded-lg px-3 py-1 transition-colors {currentPath === `/admin/${cat.slug}`
						? 'bg-white/20 text-white'
						: 'text-white/50 hover:text-white'}"
				>
					{cat.name}
				</a>
			{/each}
			<a
				href="/admin/about"
				class="rounded-lg px-3 py-1 transition-colors {currentPath === '/admin/about'
					? 'bg-white/20 text-white'
					: 'text-white/50 hover:text-white'}"
			>
				About
			</a>
			<a
				href="/admin/categories"
				class="rounded-lg px-3 py-1 transition-colors {currentPath.startsWith('/admin/categories')
					? 'bg-white/20 text-white'
					: 'text-white/50 hover:text-white'}"
			>
				⚙ Categories
			</a>
			<a href="/admin/logout" class="ml-auto text-white/30 transition-colors hover:text-white">
				Log out
			</a>
		</div>
	{/if}
	{@render children()}
</div>
