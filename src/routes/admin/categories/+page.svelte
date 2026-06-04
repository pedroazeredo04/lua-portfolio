<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let newName = $state('');
	const newSlug = $derived(
		newName
			.toLowerCase()
			.trim()
			.replace(/\s+/g, '-')
			.replace(/[^a-z0-9-]/g, '')
	);
</script>

<svelte:head><title>Admin – Categories</title></svelte:head>

<h2 class="mb-6 text-2xl font-medium text-white">Categories</h2>

<!-- Existing categories -->
<div class="mb-8 overflow-hidden rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm">
	<table class="w-full text-sm text-white/80">
		<thead>
			<tr class="border-b border-white/10 text-left text-xs text-white/40">
				<th class="px-4 py-3">Preview</th>
				<th class="px-4 py-3">Name</th>
				<th class="px-4 py-3">Slug</th>
				<th class="px-4 py-3">Order</th>
				<th class="px-4 py-3"></th>
			</tr>
		</thead>
		<tbody>
			{#each data.categories as cat (cat.id)}
				<tr class="border-b border-white/5 last:border-0">
					<td class="px-4 py-3">
						{#if cat.previewImage}
							<img src={cat.previewImage} alt={cat.name} class="h-10 w-16 rounded object-cover" />
						{:else}
							<div class="h-10 w-16 rounded bg-white/5"></div>
						{/if}
					</td>
					<td class="px-4 py-3 font-medium text-white">{cat.name}</td>
					<td class="px-4 py-3 font-mono text-white/50">{cat.slug}</td>
					<td class="px-4 py-3 text-white/60">{cat.order}</td>
					<td class="px-4 py-3">
						<div class="flex gap-2">
							<a
								href="/admin/categories/{cat.id}"
								class="rounded px-3 py-1 text-xs bg-white/10 text-white transition-colors hover:bg-white/20"
							>
								Edit
							</a>
							<form
								method="POST"
								action="?/delete"
								use:enhance={({ cancel }) => {
									if (!confirm(`Delete "${cat.name}"? This cannot be undone.`)) cancel();
								}}
							>
								<input type="hidden" name="id" value={cat.id} />
								<button
									type="submit"
									class="rounded px-3 py-1 text-xs bg-red-900/30 text-red-400 transition-colors hover:bg-red-900/50"
								>
									Delete
								</button>
							</form>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<!-- Add new category -->
<div class="rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
	<h3 class="mb-4 font-medium text-white">Add new category</h3>
	<form
		method="POST"
		action="?/create"
		enctype="multipart/form-data"
		use:enhance
		class="space-y-4"
	>
		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="mb-1 block text-sm text-white/60" for="name">Name *</label>
				<input
					id="name"
					name="name"
					type="text"
					required
					bind:value={newName}
					class="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
				/>
			</div>
			<div>
				<label class="mb-1 block text-sm text-white/60" for="slug">Slug (auto-filled)</label>
				<input
					id="slug"
					name="slug"
					type="text"
					value={newSlug}
					placeholder="auto-generated"
					class="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/60 focus:outline-none focus:ring-2 focus:ring-white/20"
				/>
			</div>
		</div>
		<div>
			<label class="mb-1 block text-sm text-white/60" for="description">Description</label>
			<textarea
				id="description"
				name="description"
				rows="2"
				class="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
			></textarea>
		</div>
		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="mb-1 block text-sm text-white/60" for="order">Display order</label>
				<input
					id="order"
					name="order"
					type="number"
					value={data.categories.length + 1}
					class="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
				/>
			</div>
			<div>
				<label class="mb-1 block text-sm text-white/60" for="previewImage">Preview image</label>
				<input
					id="previewImage"
					name="previewImage"
					type="file"
					accept="image/*"
					class="w-full text-sm text-white/60 file:mr-3 file:rounded file:border-0 file:bg-white/10 file:px-3 file:py-1 file:text-sm file:text-white hover:file:bg-white/20"
				/>
			</div>
		</div>
		{#if form?.createError}
			<p class="text-sm text-red-400">{form.createError}</p>
		{/if}
		<button
			type="submit"
			class="rounded-lg bg-white/10 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
		>
			Create category
		</button>
	</form>
</div>
