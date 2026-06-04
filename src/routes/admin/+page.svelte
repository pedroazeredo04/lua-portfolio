<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head><title>Admin Login</title></svelte:head>

<div class="flex min-h-[60vh] items-center justify-center">
	<div class="w-full max-w-sm rounded-xl border border-white/10 bg-black/30 p-8 backdrop-blur-sm">
		<h1 class="mb-6 text-xl font-medium text-white">Admin Login</h1>
		<form method="POST" use:enhance>
			<label class="mb-1 block text-sm text-white/60" for="password">Password</label>
			<input
				id="password"
				name="password"
				type="password"
				class="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20"
				autocomplete="current-password"
				required
			/>
			{#if form?.error}
				<p class="mt-2 text-sm text-red-400">{form.error}</p>
			{/if}
			<button
				type="submit"
				class="mt-4 w-full rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
			>
				Log in
			</button>
		</form>
	</div>
</div>
