<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let editingId = $state<string | null>(null);
</script>

<svelte:head><title>Admin – {data.category.name}</title></svelte:head>

<h2 class="mb-6 text-2xl font-medium text-white">{data.category.name}</h2>

<!-- Upload form -->
<div class="mb-8 rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
	<h3 class="mb-4 font-medium text-white">Add a post</h3>
	<form
		method="POST"
		action="?/upload"
		enctype="multipart/form-data"
		use:enhance
		class="space-y-4"
	>
		<div>
			<label class="mb-1 block text-sm text-white/60" for="image">Image *</label>
			<input
				id="image"
				name="image"
				type="file"
				accept="image/*"
				required
				class="block w-full text-sm text-white/60 file:mr-3 file:rounded file:border-0 file:bg-white/10 file:px-3 file:py-1 file:text-sm file:text-white hover:file:bg-white/20"
			/>
		</div>
		<div>
			<label class="mb-1 block text-sm text-white/60" for="caption">Caption (optional)</label>
			<textarea
				id="caption"
				name="caption"
				rows="2"
				class="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
			></textarea>
		</div>
		<div>
			<label class="mb-1 block text-sm text-white/60" for="description">Description (optional)</label>
			<textarea
				id="description"
				name="description"
				rows="3"
				class="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
			></textarea>
		</div>
		{#if form?.error}
			<p class="text-sm text-red-400">{form.error}</p>
		{/if}
		<button
			type="submit"
			class="rounded-lg bg-white/10 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
		>
			Upload
		</button>
	</form>
</div>

<!-- Posts grid -->
{#if data.posts.length === 0}
	<p class="text-sm text-white/40">No posts yet. Upload your first image above.</p>
{:else}
	<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
		{#each data.posts as post (post.id)}
			<div class="relative overflow-hidden rounded-xl border border-white/10 bg-black/20">
				<img src={post.image} alt={post.caption} class="h-40 w-full object-cover" />
				{#if editingId === post.id}
					<form method="POST" action="?/editCaption" use:enhance={() => async ({ update }) => { await update(); editingId = null; }} class="p-2 space-y-1">
						<input type="hidden" name="id" value={post.id} />
						<textarea
							name="caption"
							rows="2"
							placeholder="Caption"
							class="w-full rounded border border-white/10 bg-white/5 px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-white/20"
						>{post.caption}</textarea>
						<textarea
							name="description"
							rows="2"
							placeholder="Description (expandable)"
							class="w-full rounded border border-white/10 bg-white/5 px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-white/20"
						>{post.description ?? ''}</textarea>
						<div class="mt-1 flex gap-1">
							<button
								type="submit"
								class="rounded bg-white/10 px-2 py-0.5 text-xs text-white transition-colors hover:bg-white/20"
							>Save</button>
							<button
								type="button"
								onclick={() => (editingId = null)}
								class="rounded bg-white/5 px-2 py-0.5 text-xs text-white/50 transition-colors hover:bg-white/10"
							>Cancel</button>
						</div>
					</form>
				{:else}
					<div class="p-2">
						<p class="line-clamp-2 text-xs text-white/60">{post.caption || '(no caption)'}</p>
						<p class="mt-1 text-[10px] text-white/30">
							{new Date(post.createdAt).toLocaleDateString()}
						</p>
					</div>
					<button
						onclick={() => (editingId = post.id)}
						class="absolute left-2 top-2 rounded bg-white/10 px-2 py-0.5 text-xs text-white/60 transition-colors hover:bg-white/20"
						aria-label="Edit caption"
					>✎</button>
				{/if}
				<form
					method="POST"
					action="?/delete"
					use:enhance={({ cancel }) => {
						if (!confirm('Delete this post?')) cancel();
					}}
					class="absolute right-2 top-2"
				>
					<input type="hidden" name="id" value={post.id} />
					<button
						type="submit"
						class="rounded bg-red-900/60 px-2 py-0.5 text-xs text-red-300 transition-colors hover:bg-red-900/80"
					>
						✕
					</button>
				</form>
			</div>
		{/each}
	</div>
{/if}
