<script lang="ts">
	import { onDestroy, tick } from 'svelte';
	import type { PageData } from './$types';
	import type { Post } from '$lib/server/posts';
	import { lightboxOpen } from '$lib/stores/lightbox';

	let { data }: { data: PageData } = $props();

	let lightbox: Post | null = $state(null);
	let zoom = $state(1);
	let baseWidth = $state<number | null>(null);
	let baseHeight = $state<number | null>(null);
	let imgEl = $state<HTMLImageElement | null>(null);
	let contentEl = $state<HTMLDivElement | null>(null);

	const CLICK_ZOOM = 2;
	const ZOOM_MAX = 5;
	const WHEEL_FACTOR = 0.004;

	function open(post: Post) { lightbox = post; lightboxOpen.set(true); zoom = 1; baseWidth = null; baseHeight = null; }
	function close() { lightbox = null; lightboxOpen.set(false); zoom = 1; }

	function onImgLoad() {
		if (!imgEl) return;
		const rect = imgEl.getBoundingClientRect();
		baseWidth = rect.width;
		baseHeight = rect.height;
	}

	async function zoomToPoint(newZoom: number, clientX: number, clientY: number) {
		if (!contentEl || !baseWidth || !baseHeight || newZoom === zoom) return;

		const rect = contentEl.getBoundingClientRect();
		const mx = clientX - rect.left;
		const my = clientY - rect.top;

		const oldZoom = zoom;
		const imageX = (oldZoom > 1 ? contentEl.scrollLeft : 0) + mx;
		const imageY = (oldZoom > 1 ? contentEl.scrollTop  : 0) + my;
		const fx = Math.max(0, Math.min(1, imageX / (baseWidth  * oldZoom)));
		const fy = Math.max(0, Math.min(1, imageY / (baseHeight * oldZoom)));

		zoom = newZoom;
		await tick();

		if (newZoom > 1) {
			contentEl.scrollLeft = fx * baseWidth  * newZoom - mx;
			contentEl.scrollTop  = fy * baseHeight * newZoom - my;
		}
	}

	onDestroy(() => lightboxOpen.set(false));

	$effect(() => {
		if (!lightbox) return;
		const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});

	$effect(() => {
		if (!imgEl) return;
		const el = imgEl;
		const handler = (e: WheelEvent) => {
			e.preventDefault();
			const newZoom = Math.max(1, Math.min(ZOOM_MAX, zoom - e.deltaY * WHEEL_FACTOR));
			zoomToPoint(newZoom, e.clientX, e.clientY);
		};
		el.addEventListener('wheel', handler, { passive: false });
		return () => el.removeEventListener('wheel', handler);
	});
</script>

<svelte:head>
	<title>sailorlua – {data.category.name.toLowerCase()}</title>
</svelte:head>

<div class="projects-layout" class:projects-layout--has-posts={data.posts.length > 0}>
	<div class="projects-title">
		<h1 class="font-display text-4xl font-normal tracking-wide text-white sm:text-5xl">
			{data.category.name.toUpperCase()}
		</h1>
		<p class="projects-title__desc">{data.category.description}</p>
	</div>

	{#if data.posts.length > 0}
		<div class="posts-grid">
			{#each data.posts as post (post.id)}
				<figure class="posts-grid__item">
					<button class="posts-grid__thumb" onclick={() => open(post)} aria-label="View image full size">
						<img src={post.image} alt={post.caption} loading="lazy" />
					</button>
					{#if post.caption}
						<figcaption>{post.caption}</figcaption>
					{/if}
				</figure>
			{/each}
		</div>
	{/if}
</div>

{#if lightbox}
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<div class="lightbox" onclick={close} role="dialog" aria-modal="true" aria-label="Image viewer" tabindex="-1">
		<button class="lightbox__close" onclick={(e) => { e.stopPropagation(); close(); }} aria-label="Close">
			✕
		</button>
		<div class="lightbox__content" class:lightbox__content--zoomed={zoom > 1} bind:this={contentEl} onclick={(e) => e.stopPropagation()} role="presentation">
			<img
				class="lightbox__img"
				bind:this={imgEl}
				src={lightbox.image}
				alt={lightbox.caption}
				onload={onImgLoad}
				onclick={(e) => zoomToPoint(zoom === 1 ? CLICK_ZOOM : 1, e.clientX, e.clientY)}
				style:cursor={zoom > 1 ? 'zoom-out' : 'zoom-in'}
				style:width={zoom > 1 && baseWidth != null ? `${baseWidth * zoom}px` : null}
				style:max-width={zoom > 1 && baseWidth != null ? 'none' : null}
				style:max-height={zoom > 1 && baseWidth != null ? 'none' : null}
			/>
			{#if lightbox.caption}
				<p class="lightbox__caption">{lightbox.caption}</p>
			{/if}
		</div>
	</div>
{/if}
