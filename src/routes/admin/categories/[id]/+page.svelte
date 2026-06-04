<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head><title>Admin – Edit {data.category.name}</title></svelte:head>

<div class="mb-4">
	<a href="/admin/categories" class="text-sm text-white/50 transition-colors hover:text-white"
		>← Back to categories</a
	>
</div>

<div class="max-w-xl rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
	<h2 class="mb-6 text-xl font-medium text-white">Edit: {data.category.name}</h2>

	<form method="POST" enctype="multipart/form-data" use:enhance class="space-y-4">
		<div>
			<label class="mb-1 block text-sm text-white/60" for="name">Name *</label>
			<input
				id="name"
				name="name"
				type="text"
				required
				value={data.category.name}
				class="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
			/>
		</div>
		<div>
			<label class="mb-1 block text-sm text-white/60" for="description">Description</label>
			<textarea
				id="description"
				name="description"
				rows="3"
				class="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
				>{data.category.description}</textarea
			>
		</div>
		<div>
			<label class="mb-1 block text-sm text-white/60" for="order">Display order</label>
			<input
				id="order"
				name="order"
				type="number"
				value={data.category.order}
				class="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
			/>
		</div>
		<div>
			<label class="mb-1 block text-sm text-white/60" for="previewImage">Preview image</label>
			{#if data.category.previewImage}
				<img
					src={data.category.previewImage}
					alt={data.category.name}
					class="mb-2 h-24 w-40 rounded-lg object-cover"
				/>
				<p class="mb-2 text-xs text-white/30">Upload a new image to replace the current one</p>
			{/if}
			<input
				id="previewImage"
				name="previewImage"
				type="file"
				accept="image/*"
				class="w-full text-sm text-white/60 file:mr-3 file:rounded file:border-0 file:bg-white/10 file:px-3 file:py-1 file:text-sm file:text-white hover:file:bg-white/20"
			/>
		</div>
		{#if form?.error}
			<p class="text-sm text-red-400">{form.error}</p>
		{/if}
		<div class="flex gap-3 pt-2">
			<button
				type="submit"
				class="rounded-lg bg-white/10 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
			>
				Save changes
			</button>
			<a
				href="/admin/categories"
				class="rounded-lg px-6 py-2 text-sm text-white/40 transition-colors hover:text-white"
			>
				Cancel
			</a>
		</div>
	</form>
</div>
