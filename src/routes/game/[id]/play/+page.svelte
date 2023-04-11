<script lang="ts">
	import type { ActionData, PageData } from "./$types";
	import { enhance } from "$app/forms";
	import Waiting from "./waiting.svelte";
	import Wanted from "./wanted.svelte";
	import { redirect } from "@sveltejs/kit";

	export let data: PageData;
	export let form: ActionData;

	if (data.game.status === 'finished') {
		throw redirect(303, `/game/${data.lobby.id}/results`);
	}

	const seed = data.user.id;
	const timeElapsed = data.user;

	const wanted = data.lobby.data.wanted;
	const lobbyData = data.lobby.data;

	$: waitingIndex = form?.nextChoice ?? data.nextChoice ?? 0;
	$: currentlyWaiting = data.lobby.data?.waiting?.[waitingIndex];
</script>

<svelte:head>
	<title>Faces Game</title>
</svelte:head>

<main class="flex flex-row">
	<section class="flex-1">
		<h1>Wanted People</h1>
		<div class="flex flex-row gap-2 m-2">
			<div class="flex flex-col gap-2">
				{#each wanted.slice(0, wanted.length / 2) as person}
					<Wanted data={person} />
				{/each}
			</div>
			<div class="flex flex-col gap-2">
				{#each wanted.slice(wanted.length / 2) as person}
					<Wanted data={person} />
				{/each}
			</div>
		</div>
	</section>
	<section class="flex-1 flex flex-col items-center">
		<h1 class="my-16 text-2xl">Currently Waiting</h1>
		<div class="flex flex-col gap-2 m-2">
			{#each data.lobby.data.waiting as person, i}
				{#if i === waitingIndex}
					<Waiting data={person} />
				{/if}
			{/each}
		</div>
		<form class="w-full" method="post" use:enhance>
			<div class="flex flex-row items-center gap-2 h-24">
				<input type="text" bind:value={currentlyWaiting.seed} name="waitingIndex" hidden>
				<button class="flex-1 h-full w-full p-2 bg-green-400 rounded-md" type="submit" formaction="?/allow">Allow</button>
				<button class="flex-1 h-full w-full p-2 bg-red-400 rounded-md" type="submit" formaction="?/deny">Deny</button>
				<button class="flex-1 h-full w-full p-2 bg-red-600 rounded-md" type="submit" formaction="?/report">Report</button>
			</div>
		</form>
		<!-- <p>{data.game.coins}</p> -->
		{#if !form?.success}
			<p>{form?.error ?? ''}</p>
		{/if}
	</section>
</main>

<!-- <pre class="mt-32">{JSON.stringify(data.user, undefined, 4)}</pre>

<pre>{JSON.stringify(data.game, undefined, 4)}</pre> -->