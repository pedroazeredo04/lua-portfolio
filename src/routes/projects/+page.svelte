<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>sailorlua – projects</title>
</svelte:head>

<div class="projects-layout">
	<div class="projects-title">
		<h1 class="font-display text-4xl font-normal tracking-wide text-white sm:text-5xl">
			MY PROJECTS
		</h1>
		<p class="projects-title__desc">
			Please feel free to check out some of the stuff I have done :)
		</p>
	</div>

	<div class="category-strip">
		{#each data.categories as cat (cat.id)}
			<a
				href={resolve(`/projects/${cat.slug}`)}
				class="category-card"
				style={cat.previewImage ? `background-image: url('${cat.previewImage}')` : ''}
				aria-label={cat.name}
			>
				<div class="category-card__overlay">
					<span class="category-card__name font-display">{cat.name}</span>
					<p class="category-card__desc">{cat.description}</p>
				</div>
			</a>
		{/each}
	</div>
</div>
