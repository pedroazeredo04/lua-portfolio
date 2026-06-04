<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>sailorlua – about</title>
</svelte:head>

<div class="about-layout">
	<div class="about-text">
		<h1 class="font-display text-5xl font-normal tracking-wide text-white sm:text-6xl">ABOUT</h1>
		<p class="about-body">{data.about.bio}</p>
	</div>
	<div class="about-arch-wrap">
		<div class="about-arch-frame"></div>
		<div class="about-arch" style="background-image: url('{data.about.photo}')"></div>
		<div class="arch-moons">
			<span class="arch-moon-sphere"></span>
			<span class="arch-moon-sphere"></span>
			<span class="arch-moon-sphere"></span>
			<span class="arch-moon-sphere"></span>
			<span class="arch-moon-sphere"></span>
			<span class="arch-moon-sphere"></span>
			<span class="arch-moon-sphere"></span>
		</div>
	</div>
</div>
