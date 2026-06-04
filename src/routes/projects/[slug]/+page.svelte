<script lang="ts">
	import type { PageData } from './$types';
	import type { Post } from '$lib/server/posts';

	let { data }: { data: PageData } = $props();

	let lightbox: Post | null = $state(null);

	function open(post: Post) { lightbox = post; }
	function close() { lightbox = null; }

	$effect(() => {
		if (!lightbox) return;
		const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
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
		<div class="lightbox__content" onclick={(e) => e.stopPropagation()} role="presentation">
			<img class="lightbox__img" src={lightbox.image} alt={lightbox.caption} />
			{#if lightbox.caption}
				<p class="lightbox__caption">{lightbox.caption}</p>
			{/if}
		</div>
	</div>
{/if}
