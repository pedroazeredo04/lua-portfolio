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
			description: 'Discover more about me',
			cardTitle: 'Profile',
			cardBody: 'Minimal placeholder for now.'
		},
		{
			id: 'projects',
			path: '/projects',
			phase: 'waxing',
			label: 'Waxing Moon',
			title: 'PROJECTS',
			description: 'Selected work, experiments and hobby projects.',
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

	function scrollToPanel2() {
		const container = document.querySelector<HTMLElement>('.home-scroll');
		if (container) container.scrollTop = container.clientHeight;
	}

	function scrollToPanel1() {
		const container = document.querySelector<HTMLElement>('.home-scroll');
		if (container) container.scrollTop = 0;
	}

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<section
	class="bg-space text-white"
	class:home-scroll={activeSection.id === 'home'}
	class:non-home={activeSection.id !== 'home'}
>
	{#if activeSection.id === 'home'}
		<!-- Panel 1: hero -->
		<div class="home-panel" transition:fade={{ duration: 300 }}>
			<div class="hero-moon-bottom">
				<div class="moon-shell">
					<div class="moon" data-phase="full" aria-label="Full Moon">
						<img src={moonTexture} alt="" class="moon__img" draggable="false" />
					</div>
				</div>
				<button
					class="scroll-down-arrow"
					onclick={scrollToPanel2}
					onpointerdown={preventFocusOnPointerDown}
					aria-label="Explore sections"
				>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
						<polyline points="6 9 12 15 18 9"></polyline>
					</svg>
				</button>
			</div>

			<div class="relative z-10 grid h-screen grid-rows-[auto_1fr] grid-cols-12 gap-4 px-6 sm:px-10
  pointer-events-none">
				<nav class="relative col-span-12 flex h-20 items-center justify-center text-xs tracking-[0.35em] text-white/70 sm:h-24 pointer-events-auto">
					<div class="font-display select-none text-sm tracking-[0.3em] text-white/90">SAILORLUA</div>
					<div class="absolute right-0 hidden items-center gap-6 lg:flex">
						{#each sections as s (s.id)}
							<a
								href={resolve(s.path)}
								class="transition-colors duration-150 hover:text-white/80 {s.path === activeSection.path ? 'text-white/90' : 'text-white/45'}"
								aria-current={s.path === activeSection.path ? 'page' : undefined}
							>
								{s.id === 'home' ? 'HOME' : s.title}
							</a>
						{/each}
					</div>
				</nav>

				<div
					class="col-span-12 flex flex-col items-center justify-start pt-[6vh] sm:pt-[12vh] text-center"
					in:fade={{ duration: 220, delay: 180 }}
					out:fade={{ duration: 150 }}
				>
					<h1 class="section-title font-display text-6xl font-normal tracking-wide sm:text-8xl">
						{activeSection.title}
					</h1>
					<p class="mx-auto mt-8 max-w-sm text-xl text-white/50">{activeSection.description}</p>
				</div>
			</div>
		</div>

		<!-- Panel 2: navigation cards -->
		<div class="home-panel">
			<div class="hero-moon-top">
				<div class="moon-shell">
					<div class="moon" data-phase="full">
						<img src={moonTexture} alt="" class="moon__img" draggable="false" />
					</div>
				</div>
				<button
					class="scroll-up-arrow"
					onclick={scrollToPanel1}
					onpointerdown={preventFocusOnPointerDown}
					aria-label="Back to top"
				>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
						<polyline points="18 15 12 9 6 15"></polyline>
					</svg>
				</button>
			</div>

			<div class="nav-cards">
				{#each sections.slice(1) as s (s.id)}
					<a href={resolve(s.path)} class="nav-card">
						<span class="nav-card__title font-display">{s.title}</span>
						<span class="nav-card__desc">{s.description}</span>
					</a>
				{/each}
			</div>
		</div>

	{:else}
		<!-- Other pages: three-column layout -->
		<div
			class="relative z-10 grid min-h-screen grid-cols-12 gap-4 px-6 sm:px-10 sm:grid-rows-[auto_1fr]"
			transition:fade={{ duration: 300 }}
		>
			<nav
				class="relative col-span-12 flex h-20 items-center justify-center text-xs tracking-[0.35em] text-white/70 sm:h-24"
			>
				<div class="font-display select-none text-sm tracking-[0.3em] text-white/90">SAILORLUA</div>

				<div class="absolute right-0 hidden items-center gap-6 lg:flex">
					{#each sections as s (s.id)}
						<a
							href={resolve(s.path)}
							class="transition-colors duration-150 hover:text-white/80 {s.path === activeSection.path ? 'text-white/90' : 'text-white/45'}"
							aria-current={s.path === activeSection.path ? 'page' : undefined}
						>
							{s.id === 'home' ? 'HOME' : s.title}
						</a>
					{/each}
				</div>
			</nav>

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
		</div>
	{/if}

	<div class="sr-only">{@render children()}</div>
</section>
