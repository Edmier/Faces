<script lang="ts">
	import Face from "../play/face.svelte";
	import Waiting from "../play/waiting.svelte";
import type { PageData } from "./$types";

	export let data: PageData;

	const wanted = data.lobby.data.wanted;
	const waiting = data.lobby.data.waiting;
	const choices = data.game.choices;

	const allowed = choices.filter(c => c.choice === 'admit');
	const denied = choices.filter(c => c.choice === 'deny');
	const reported = choices.filter(c => c.choice === 'report');
</script>

<main class="flex flex-col items-center">
	<h1 class="text-2xl my-16">Results</h1>

	<p>Admitted <span class="text-green-400">{allowed.length}</span></p>
	<p>Denied <span class="text-red-400">{denied.length}</span></p>
	<p>Reported <span class="text-yellow-400">{reported.length}</span></p>

	<form method="post" action="?/logout">
		<button class="p-4 px-8 bg-gray-200 rounded-md">Logout</button>
	</form>

	<section>
		<h2 class="text-xl">Reported People</h2>
		<div class="flex flex-row gap-2">
			{#each reported as person}
				<div class="flex flex-col items-center">
					<Waiting data={waiting.find(w => w.seed === person.person)} />
						{#if person.warranted}
							<p class="text-green-400">Blocked a criminal!</p>
						{:else}
							<p class="text-red-400">Blocked an innocent!</p>
						{/if}
				</div>
			{/each}
		</div>
	</section>

	<section>
		<h2 class="text-xl">Actual Wanted People</h2>
		<div class="flex flex-row gap-2">
			{#each wanted as person}
				<div class="flex flex-col items-center">
					<Waiting data={waiting.find(w => w.seed === person.seed)} />
					<!-- <p>{person.guilty}</p> -->
				</div>
			{/each}
		</div>
	</section>
</main>

