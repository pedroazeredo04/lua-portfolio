<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/moon-favicon.png';
	import moonTexture from '$lib/assets/moon.webp';

	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { onNavigate } from '$app/navigation';
	import { lightboxOpen } from '$lib/stores/lightbox';

	type Section = {
		id: 'home' | 'about' | 'projects' | 'contact';
		path: '/' | '/about' | '/projects' | '/contact';
		title: string;
		description: string;
	};

	const sections: Section[] = [
		{
			id: 'home',
			path: '/',
			title: 'SAILORLUA',
			description: 'Portfólio de Luane Catarina Berti Santos'
		},
		{
			id: 'about',
			path: '/about',
			title: 'ABOUT',
			description: 'Discover more about me'
		},
		{
			id: 'projects',
			path: '/projects',
			title: 'PROJECTS',
			description: 'Selected work, experiments and hobby projects.'
		},
		{
			id: 'contact',
			path: '/contact',
			title: 'CONTACT',
			description: 'Say hi. Links and ways to reach me.'
		}
	];

	function normalizePath(pathname: string): Section['path'] {
		if (pathname === '/') return '/';
		if (pathname.endsWith('/')) return pathname.slice(0, -1) as Section['path'];
		return pathname as Section['path'];
	}

	const activePath = $derived(normalizePath(page.url.pathname));
	const activeIndex = $derived(
		sections.findIndex((s) =>
			s.path === '/' ? activePath === '/' : activePath.startsWith(s.path)
		)
	);
	const activeSection = $derived(activeIndex >= 0 ? sections[activeIndex] : null);
	const isProjectCategory = $derived(
		activePath !== '/projects' && activePath.startsWith('/projects')
	);

	function preventFocusOnPointerDown(event: PointerEvent) {
		event.preventDefault();
	}

	function scrollToPanel2() {
		const container = document.querySelector<HTMLElement>('.home-scroll');
		if (container) container.scrollTop = container.clientHeight;
	}

	function scrollToPanel1() {
		const container = document.querySelector<HTMLElement>('.home-scroll');
		if (container) container.scrollTop = 0;
	}

	let menuOpen = $state(false);
	$effect(() => { activePath; menuOpen = false; });

	let sectionEl: HTMLElement | null = $state(null);

	onNavigate(() => {
		if (sectionEl && activeSection?.id === 'home') {
			sectionEl.style.scrollBehavior = 'auto';
			sectionEl.scrollTop = 0;
			sectionEl.style.scrollBehavior = '';
		}
	});

	$effect(() => {
		if (activeSection?.id === 'home') {
			const container = document.querySelector<HTMLElement>('.home-scroll');
			if (container) {
				container.style.scrollBehavior = 'auto';
				container.scrollTop = 0;
				container.style.scrollBehavior = '';
			}
		}
	});

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<section
	class="bg-space text-white"
	class:home-scroll={activeSection?.id === 'home'}
	bind:this={sectionEl}
>
	{#if activeSection !== null && activeSection.id === 'home'}
		<!-- Panel 1: hero -->
		<div class="home-panel">
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

			<div class="relative z-10 grid h-screen grid-rows-[auto_1fr] grid-cols-12 gap-4 px-6 sm:px-10 pointer-events-none">
				<nav class="relative col-span-12 flex h-20 items-center justify-center text-xs tracking-[0.35em] text-white/70 sm:h-24 pointer-events-auto">
					<div class="font-script select-none text-sm tracking-[0.3em] text-white/90">sailorlua</div>
					<div class="absolute right-0 hidden items-center gap-6 lg:flex">
						{#each sections as s (s.id)}
							<a
								href={resolve(s.path)}
								class="transition-colors duration-150 hover:text-white/80 {s.path === activeSection?.path ? 'text-white/90' : 'text-white/45'}"
								aria-current={s.path === activeSection?.path ? 'page' : undefined}
							>
								{s.id === 'home' ? 'HOME' : s.title}
							</a>
						{/each}
					</div>
				</nav>

				<div
					class="col-span-12 flex flex-col items-center justify-start pt-[6vh] sm:pt-[12vh] text-center"
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
	{@render children()}

	{:else}
		<div>
			<nav class="relative flex h-20 items-center justify-center px-6 text-xs tracking-[0.35em] text-white/70 sm:h-24 sm:px-10">
				{#if isProjectCategory}
					<a href={resolve('/projects')} class="projects-back absolute left-4 sm:left-16">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<polyline points="15 18 9 12 15 6"></polyline>
						</svg>
						PROJECTS
					</a>
				{/if}
				<div class="font-script select-none text-sm tracking-[0.3em] text-white/90">sailorlua</div>
				<div class="absolute right-6 hidden items-center gap-6 lg:flex sm:right-10">
					{#each sections as s (s.id)}
						<a
							href={resolve(s.path)}
							class="transition-colors duration-150 hover:text-white/80 {s.path === activeSection?.path ? 'text-white/90' : 'text-white/45'}"
							aria-current={s.path === activeSection?.path ? 'page' : undefined}
						>
							{s.id === 'home' ? 'HOME' : s.title}
						</a>
					{/each}
				</div>
			</nav>
			{@render children()}
		</div>
	{/if}

	<!-- Single fixed button: shows ≡ or ✕ at the exact same screen position -->
	{#if !$lightboxOpen}
		<button
			class="burger-btn lg:hidden"
			onclick={() => (menuOpen = !menuOpen)}
			aria-label={menuOpen ? 'Close menu' : 'Open menu'}
		>
			{#if menuOpen}
				<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round">
					<line x1="18" y1="6" x2="6" y2="18" />
					<line x1="6"  y1="6" x2="18" y2="18" />
				</svg>
			{:else}
				<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round">
					<line x1="3" y1="6"  x2="21" y2="6" />
					<line x1="3" y1="12" x2="21" y2="12" />
					<line x1="3" y1="18" x2="21" y2="18" />
				</svg>
			{/if}
		</button>

		{#if menuOpen}
			<div class="mobile-menu">
				{#each sections as s (s.id)}
					<a
						href={resolve(s.path)}
						class="mobile-menu-link {s.path === activeSection?.path ? 'active' : ''}"
						aria-current={s.path === activeSection?.path ? 'page' : undefined}
					>
						{s.id.charAt(0).toUpperCase() + s.id.slice(1)}
					</a>
				{/each}
			</div>
		{/if}
	{/if}
</section>
