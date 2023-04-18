<script lang="ts">
	import type { WaitingData, WantedData } from '$pb/pocketbase';
	import Face from './face.svelte';

	export let data: WaitingData | WantedData | undefined;
</script>

<section class="block max-w-sm p-4 -pt-4 m-4 shadow-xl">
	<div class="flex flex-col">
		<div class="object-contain h-full block">
			<Face face={data?.face ?? null} />
		</div>
	</div>
</section>