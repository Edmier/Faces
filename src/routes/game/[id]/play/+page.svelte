<script lang="ts">
	import type { PageData } from "./$types";
	import Wanted from "./wanted.svelte";

	export let data: PageData;

	const seed = data.user.id;
	const timeElapsed = data.user;

	const wanted = [1, 2, 3, 4, 5];
</script>

<main class="flex flex-row">
	<section class="flex-1">
		<h1>Wanted People</h1>
		<div class="flex flex-col gap-2 m-2">
			{#each wanted as person, i}
				<div class="w-48 h-48 shadow-md">
					<h2>{person}</h2>
					<Wanted {seed} spawnTime={i} />
				</div>
			{/each}
		</div>
	</section>
	<section class="flex-grow">

	</section>
</main>

<pre>{JSON.stringify(data.user, undefined, 4)}</pre>

<pre>{JSON.stringify(data.game, undefined, 4)}</pre>