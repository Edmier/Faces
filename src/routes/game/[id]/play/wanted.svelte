<script lang="ts">
	import { Generator } from "$lib/random";

	export let seed: string;
	export let spawnTime: number;

	const gen = new Generator(seed, spawnTime);
	const crime = gen.crime();
</script>

<p>{crime}</p>