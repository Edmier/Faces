<script lang="ts">
	import type { WantedData } from '$pb/pocketbase';
	import Face from './face.svelte';

	export let data: WantedData;
</script>

<section class="block max-w-sm p-4 -pt-4 shadow-xl">
	<div class="flex flex-row">
		<div class="object-contain h-full block flex-1">
			<Face face={data.face ?? null} />
		</div>
		<div class="p-4 flex-1 hidden md:block">
			<h3 class="text-lg font-bold">WANTED</h3>
			<p>{data.crime}</p>
		</div>
	</div>
</section>