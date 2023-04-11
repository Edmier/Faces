<script lang="ts">
	import Waiting from "../play/waiting.svelte";
	import type { PageData } from "./$types";

	export let data: PageData;

	const wanted = data.lobby.data.wanted;
	const waiting = data.lobby.data.waiting;
	const choices = data.game.choices;

	const allowed = choices.filter(c => c.choice === 'admit');
	const denied = choices.filter(c => c.choice === 'deny');
	const reported = choices.filter(c => c.choice === 'report');

	// console.log(allowed.filter(r => wanted.some(w => w.seed === r.person)));
</script>

<svelte:head>
	<title>Results</title>
</svelte:head>

<main class="flex flex-col items-center gap-4">
	<h1 class="text-2xl my-16">Results</h1>

	<h3 class="text-xl">You allowed <span class="text-green-400">{allowed.length}</span> people, <span class="text-red-600">{allowed.filter(r => wanted.some(w => w.seed === r.person)).length}</span> of which were wanted criminals!</h3>
	<h3 class="text-xl">You denied <span class="text-yellow-400">{denied.length}</span> people, <span class="text-red-600">{denied.filter(r => !wanted.some(w => w.seed === r.person)).length}</span> of which were innocent!</h3>
	<h3 class="text-xl">You called the police on <span class="text-red-400">{reported.length}</span> people, <span class="text-red-600">{reported.filter(r => !wanted.some(w => w.seed === r.person)).length}</span> of which were innocent!</h3>

	<form method="post" action="?/logout">
		<button class="p-4 px-8 bg-gray-200 rounded-md">Logout</button>
	</form>

	<section>
		<h2 class="text-xl">Wanted People</h2>
		<div class="flex flex-col gap-2">
			{#each wanted as person}
				<div class="flex flex-row items-center max-h-64 justify-center align-middle">
					<div class="block aspect-square object-contain max-w-16 max-h-48">
						<Waiting data={wanted.find(w => w.seed === person.seed)} />
					</div>
					{#if reported.some(r => r.person === person.seed)}
					<div class="bg-green-200 h-full w-full p-8">
							<h3 class="text-lg font-bold">ARRESTED</h3>
							<p>Your report played a key role in arresting this criminal</p>
						</div>
					{:else}
						<div class="bg-red-200 h-full w-full p-8">
							<h3 class="text-lg font-bold">AT LARGE</h3>
							<p>Despite them showing up to your place of buisness, you didn't recognize this imfamous criminal.</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</section>
</main>

