<script lang="ts">
	import { Result } from "postcss";
	import Wanted from "../play/wanted.svelte";
import type { PageData } from "./$types";

	export let data: PageData;

	const allowed = data.results.reduce((acc, result) => {
		return acc + result.admit;
	}, 0);

	const denied = data.results.reduce((acc, result) => {
		return acc + result.deny;
	}, 0);

	const reported = data.results.reduce((acc, result) => {
		return acc + result.report;
	}, 0);

	const wanted = {
		admit: data.results.reduce((acc, result) => {
			return acc + result.wanted.admit;
		}, 0),
		deny: data.results.reduce((acc, result) => {
			return acc + result.wanted.deny;
		}, 0),
		report: data.results.reduce((acc, result) => {
			return acc + result.wanted.report;
		}, 0)
	};

	const missed = data.results.reduce((acc, result) => {
		return acc + (6 - result.blockedWanted.length);
	}, 0);

	const wantedPeople = data.lobby.data.wanted;
	const blockedAmount = new Map<string, number>();

	for (const person of wantedPeople) {
		blockedAmount.set(person.seed, data.results.reduce((acc, result) => {
			return acc + (result.blockedWanted.includes(person.seed) ? 1 : 0);
		}, 0));
	}
</script>

<svelte:head>
	<title>Overall Results</title>
</svelte:head>

<section class="flex flex-col items-center">
	<h1 class="text-2xl my-16">Showing data from {data.results.length} player{data.results.length === 1 ? '' : 's'}</h1>
	
	<div class="flex flex-col gap-2">
		<h3 class="text-xl"><span class="text-green-400">{allowed}</span> people were allowed, <span class="text-red-600">{wanted.admit}</span> of which were wanted criminals!</h3>
		<h3 class="text-xl"><span class="text-yellow-400">{denied}</span> people were denied, <span class="text-red-600">{denied - wanted.deny}</span> of which were innocent!</h3>
		<h3 class="text-xl">The police were called <span class="text-red-400">{reported}</span> times, with <span class="text-red-600">{reported - wanted.report}</span> of the people being innocent!</h3>
		<h3 class="text-xl">After everything, <span class="text-red-400">{missed}</span> {missed === 1 ? 'criminal wasn\'t detected!' : 'criminals weren\'t detected!'}</h3>
	</div>

	<div class="flex flex-col gap-2 my-16">
		<h2 class="text-xl">Wanted Criminals</h2>
		<ul class="flex flex-col gap-2">
			{#each wantedPeople as wanted}
				<div class="flex flex-row gap-4 align-middle items-center">
					<Wanted data={wanted} />
					<div class="h-full">
						<h3 class="text-2xl">Blocked {blockedAmount.get(wanted.seed)}/{data.results.length} times</h3>
					</div>
				</div>
			{/each}
		</ul>
	</div>
</section>


