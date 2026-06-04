<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head><title>Admin – About</title></svelte:head>

<h2 class="mb-6 text-2xl font-medium text-white">About page</h2>

<div class="max-w-2xl rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
	<form method="POST" enctype="multipart/form-data" use:enhance class="space-y-6">
		<div>
			<label class="mb-1 block text-sm text-white/60" for="bio">Bio text</label>
			<textarea
				id="bio"
				name="bio"
				rows="8"
				class="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
			>{data.about.bio}</textarea>
		</div>
		<div>
			<label class="mb-1 block text-sm text-white/60" for="photo">Profile photo</label>
			<div class="mb-3 flex items-start gap-4">
				<img
					src={data.about.photo}
					alt="Current profile"
					class="h-32 w-24 rounded-lg object-cover object-top"
				/>
				<p class="text-xs text-white/30 mt-1">Upload a new photo to replace the current one.<br />Leave empty to keep it unchanged.</p>
			</div>
			<input
				id="photo"
				name="photo"
				type="file"
				accept="image/*"
				class="w-full text-sm text-white/60 file:mr-3 file:rounded file:border-0 file:bg-white/10 file:px-3 file:py-1 file:text-sm file:text-white hover:file:bg-white/20"
			/>
		</div>
		<button
			type="submit"
			class="rounded-lg bg-white/10 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
		>
			Save changes
		</button>
	</form>
</div>
