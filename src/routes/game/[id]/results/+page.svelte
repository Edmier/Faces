<script lang="ts">
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

	{#each allowed as admitted}
		<div class="flex flex-row gap-2">
			<div class="flex flex-col gap-2">
				<p class="text-lg">Admitted</p>
			</div>
		</div>
	{/each}

	{#each denied as denied}
		<div class="flex flex-row gap-2">
			<div class="flex flex-col gap-2">
				<p class="text-lg">Denied</p>
			</div>
		</div>
	{/each}

	{#each reported as reported}
		<div class="flex flex-row gap-2">
			<div class="flex flex-col gap-2">
				<p class="text-lg">Reported</p>
			</div>
		</div>
	{/each}
</main>

