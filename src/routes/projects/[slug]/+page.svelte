<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>sailorlua – {data.category.name.toLowerCase()}</title>
</svelte:head>

<div class="projects-layout">
	<div class="projects-title">
		<h1 class="font-display text-5xl font-normal tracking-wide text-white sm:text-6xl">
			{data.category.name.toUpperCase()}
		</h1>
		<p class="projects-title__desc">{data.category.description}</p>
	</div>
</div>
