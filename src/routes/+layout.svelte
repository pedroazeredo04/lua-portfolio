<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/moon-favicon.png';
	import moonTexture from '$lib/assets/moon.webp';

	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { fade } from 'svelte/transition';

	type Phase = 'full' | 'new' | 'waxing' | 'waning';

	type Section = {
		id: 'home' | 'about' | 'projects' | 'contact';
		path: '/' | '/about' | '/projects' | '/contact';
		phase: Phase;
		label: string;
		title: string;
		description: string;
		cardTitle: string;
		cardBody: string;
	};

	const sections: Section[] = [
		{
			id: 'home',
			path: '/',
			phase: 'full',
			label: 'Full Moon',
			title: 'SAILORLUA',
			description: 'Portfólio de Luane Catarina Berti Santos',
			cardTitle: 'Welcome',
			cardBody: 'Click the arrows to navigate.'
		},
		{
			id: 'about',
			path: '/about',
			phase: 'new',
			label: 'New Moon',
			title: 'ABOUT',
			description: 'A short story, skills, and what I love building.',
			cardTitle: 'Profile',
			cardBody: 'Minimal placeholder for now.'
		},
		{
			id: 'projects',
			path: '/projects',
			phase: 'waxing',
			label: 'Waxing Moon',
			title: 'PROJECTS',
			description: 'Selected work, experiments, and shipped things.',
			cardTitle: 'Highlights',
			cardBody: 'Minimal placeholder for now.'
		},
		{
			id: 'contact',
			path: '/contact',
			phase: 'waning',
			label: 'Waning Moon',
			title: 'CONTACT',
			description: 'Say hi. Links and ways to reach me.',
			cardTitle: 'Links',
			cardBody: 'Minimal placeholder for now.'
		}
	];

	function normalizePath(pathname: string): Section['path'] {
		if (pathname === '/') return '/';
		if (pathname.endsWith('/')) return pathname.slice(0, -1) as Section['path'];
		return pathname as Section['path'];
	}

	const activePath = $derived(normalizePath(page.url.pathname));
	const activeIndex = $derived(
		Math.max(
			0,
			sections.findIndex((s) => s.path === activePath)
		)
	);
	const activeSection = $derived(sections[activeIndex]);
	const prevSection = $derived(sections[(activeIndex - 1 + sections.length) % sections.length]);
	const nextSection = $derived(sections[(activeIndex + 1) % sections.length]);

	function navigateTo(path: Section['path']) {
		if (path === activeSection.path) return;
		goto(resolve(path), { noScroll: true });
	}

	function preventFocusOnPointerDown(event: PointerEvent) {
		event.preventDefault();
	}

	function clickZone(e: MouseEvent, path: Section['path']) {
		(e.currentTarget as HTMLButtonElement).blur();
		navigateTo(path);
	}

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<section class="bg-space relative min-h-screen overflow-hidden text-white">

	<!-- Home hero: large moon peeking from below, sits behind the z-10 grid -->
	{#if activeSection.id === 'home'}
		<div class="hero-moon-bottom" transition:fade={{ duration: 400 }}>
			<div class="moon-shell">
				<div class="moon" data-phase="full" aria-label="Full Moon">
					<img src={moonTexture} alt="" class="moon__img" draggable="false" />
				</div>
			</div>
		</div>
	{/if}

	<div class="relative z-10 grid min-h-screen grid-cols-12 gap-4 px-6 sm:px-10 sm:grid-rows-[auto_1fr]">
		<nav
			class="relative col-span-12 flex h-20 items-center justify-center text-xs tracking-[0.35em] text-white/70 sm:h-24"
		>
			<div class="font-display select-none text-sm tracking-[0.3em] text-white/90">SAILORLUA</div>

			<div class="absolute right-0 hidden items-center gap-6 sm:flex">
				{#each sections as s (s.id)}
					<a
						href={resolve(s.path)}
						class="transition-colors duration-150 hover:text-white/80 {s.path === activeSection.path ? 'text-white/90' : 'text-white/45'}"
						aria-current={s.path === activeSection.path ? 'page' : undefined}
					>
						{s.title}
					</a>
				{/each}
			</div>
		</nav>

		{#if activeSection.id === 'home'}
			<!-- Home: centered title + description, moon is the background element -->
			<div
				class="col-span-12 flex flex-col items-center justify-start pt-[20vh] text-center"
				in:fade={{ duration: 220, delay: 180 }}
				out:fade={{ duration: 150 }}
			>
				<h1 class="section-title font-display text-7xl font-normal tracking-wide sm:text-9xl">
					{activeSection.title}
				</h1>
				<p class="mx-auto mt-8 max-w-sm text-xl text-white/50">{activeSection.description}</p>
			</div>
		{:else}
			<!-- Other pages: three-column layout -->
			<div
				class="col-span-12 mt-6 flex min-w-0 flex-col gap-10 sm:col-span-3 sm:col-start-2 sm:mt-0 sm:justify-center"
				in:fade={{ duration: 200, delay: 100 }}
				out:fade={{ duration: 120 }}
			>
				<div class="transition-wrapper">
					{#key activeSection.id}
						<div in:fade={{ duration: 200, delay: 130 }} out:fade={{ duration: 130 }}>
							<h1 class="section-title font-display text-6xl font-normal tracking-wide sm:text-7xl">
								{activeSection.title}
							</h1>
							<p class="mt-10 max-w-prose text-sm text-white/60">{activeSection.description}</p>
						</div>
					{/key}
				</div>
			</div>

			<div
				class="col-span-12 sm:col-span-4 sm:col-start-5 sm:flex sm:items-center sm:justify-center"
				in:fade={{ duration: 200, delay: 100 }}
				out:fade={{ duration: 120 }}
			>
				<div class="mx-auto w-full max-w-[320px] sm:max-w-[420px]">
					<div class="moon-shell">
						<div class="moon" data-phase={activeSection.phase} aria-label={activeSection.label}>
							<img src={moonTexture} alt="Moon" class="moon__img" draggable="false" />
						</div>

						<div class="moon-arrows hidden sm:block">
							<button
								class="moon-arrow moon-arrow--left"
								aria-label={`Previous: ${prevSection.title}`}
								onpointerdown={preventFocusOnPointerDown}
								onclick={(e) => clickZone(e, prevSection.path)}
							>
								<span class="moon-arrow__chev">‹</span>
								<span class="moon-arrow__label">{prevSection.title}</span>
							</button>
							<button
								class="moon-arrow moon-arrow--right"
								aria-label={`Next: ${nextSection.title}`}
								onpointerdown={preventFocusOnPointerDown}
								onclick={(e) => clickZone(e, nextSection.path)}
							>
								<span class="moon-arrow__chev">›</span>
								<span class="moon-arrow__label">{nextSection.title}</span>
							</button>
						</div>
					</div>

					<div class="mt-5 grid grid-cols-2 gap-3 sm:hidden">
						<button
							type="button"
							class="moon-mobile"
							onpointerdown={preventFocusOnPointerDown}
							onclick={(e) => clickZone(e, prevSection.path)}
						>
							<span class="moon-mobile__chev" aria-hidden="true">‹</span>
							<span class="moon-mobile__label">{prevSection.title}</span>
						</button>
						<button
							type="button"
							class="moon-mobile moon-mobile--right"
							onpointerdown={preventFocusOnPointerDown}
							onclick={(e) => clickZone(e, nextSection.path)}
						>
							<span class="moon-mobile__label">{nextSection.title}</span>
							<span class="moon-mobile__chev" aria-hidden="true">›</span>
						</button>
					</div>
				</div>
			</div>

			<div
				class="col-span-12 sm:col-span-2 sm:col-start-10 sm:flex sm:flex-col sm:justify-center"
				in:fade={{ duration: 200, delay: 100 }}
				out:fade={{ duration: 120 }}
			>
				<div class="transition-wrapper">
					{#key activeSection.id}
						<div
							class="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
							in:fade={{ duration: 200, delay: 130 }}
							out:fade={{ duration: 130 }}
						>
							<div class="text-xs tracking-[0.25em] text-white/60">{activeSection.cardTitle}</div>
							<div class="mt-4 text-sm text-white/75">{activeSection.cardBody}</div>
						</div>
					{/key}
				</div>
			</div>
		{/if}
	</div>

	<div class="sr-only">{@render children()}</div>
</section>
