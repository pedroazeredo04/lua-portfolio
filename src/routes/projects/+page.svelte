<script lang="ts">
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let stripEl: HTMLElement | null = $state(null);
	let scrollPos = $state(0);
	let scrollMax = $state(0);
	$effect(() => {
		if (!stripEl) return;
		scrollMax = stripEl.scrollWidth - stripEl.clientWidth;
	});

	const showLeft = $derived(scrollPos > 1);
	const showRight = $derived(scrollMax > 1 && scrollPos < scrollMax - 1);

	function updateScroll() {
		if (!stripEl) return;
		scrollPos = stripEl.scrollLeft;
		scrollMax = stripEl.scrollWidth - stripEl.clientWidth;
	}

	function scrollNext() {
		if (!stripEl) return;
		const cards = Array.from(stripEl.querySelectorAll<HTMLElement>('.category-card'));
		const current = stripEl.scrollLeft;
		let leftmostIdx = cards.findIndex(c => c.offsetLeft >= current - 1);
		if (leftmostIdx < 0) leftmostIdx = 0;
		const nextIdx = leftmostIdx + 1;
		const target = nextIdx < cards.length
			? Math.min(cards[nextIdx].offsetLeft, scrollMax)
			: scrollMax;
		stripEl.scrollTo({ left: target, behavior: 'smooth' });
	}

	function scrollPrev() {
		if (!stripEl) return;
		const cards = Array.from(stripEl.querySelectorAll<HTMLElement>('.category-card'));
		const current = stripEl.scrollLeft;
		let leftmostIdx = cards.findIndex(c => c.offsetLeft >= current - 1);
		if (leftmostIdx < 0) leftmostIdx = cards.length - 1;
		const prevIdx = leftmostIdx - 1;
		const target = prevIdx > 0
			? cards[prevIdx].offsetLeft
			: 0;
		stripEl.scrollTo({ left: target, behavior: 'smooth' });
	}
</script>

<svelte:head>
	<title>sailorlua – projects</title>
</svelte:head>

<div class="projects-layout">
	<div class="projects-title">
		<h1 class="font-display text-4xl font-normal tracking-wide text-white sm:text-5xl">
			PROJECTS
		</h1>
		<p class="projects-title__desc">
			Please feel free to check out some of the stuff I have done :)
		</p>
	</div>

	<div class="strip-wrapper">
		<div class="category-strip" bind:this={stripEl} onscroll={updateScroll}>
			{#each data.categories as cat (cat.id)}
				<a
					href={resolve(`/projects/${cat.slug}`)}
					class="category-card"
					style={cat.previewImage ? `background-image: url('${cat.previewImage}')` : ''}
					aria-label={cat.name}
				>
					<div class="category-card__overlay">
						<span class="category-card__name font-script">{cat.name}</span>
					</div>
				</a>
			{/each}
		</div>

		{#if showLeft}
			<button class="strip-arrow strip-arrow--left" onclick={scrollPrev} aria-label="Previous">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
					<polyline points="15 18 9 12 15 6"></polyline>
				</svg>
			</button>
		{/if}

		{#if showRight}
			<button class="strip-arrow strip-arrow--right" onclick={scrollNext} aria-label="Next">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
					<polyline points="9 18 15 12 9 6"></polyline>
				</svg>
			</button>
		{/if}
	</div>
</div>
