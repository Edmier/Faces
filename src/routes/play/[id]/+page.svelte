<script lang="ts">
	import type { ActionData } from "./$types";

	export let form: ActionData;
</script>

<main>
	<section class="flex flex-col my-16 gap-8 text-center justify-center items-center">
		<h1 class="text-4xl font-serif">Start Game</h1>
		<p class="text-lg font-sans">Enter a username and password to continue</p>

		<form method="post" action="?/join" class="flex items-center justify-center">
			<div class="relative mx-2">
				<input class="p-2 bg-gray-100 rounded-md" type="text" name="name" placeholder="Username" minlength="5" required>
				<input class="p-2 bg-gray-100 rounded-md" type="password" name="password" placeholder="Password" minlength="8" required>
				{#if form?.error}
					<p class="text-red-500 absolute text-sm">{form.error}</p>
				{/if}
			</div>
			<input class="p-2 px-4 mx-2 bg-gray-100 rounded-md" type="submit" value="Start">
		</form>

		<p class="md:w-[50%] text-sm mt-16">Feel free to use an insecure password and save it in your browser, it's only used to resume your progress and there's no personal data attached.</p>
		<p class="text-sm font-sans">Made by <a href="https://kameron.edmier.com" target="_blank">Kameron Edmier for CSE 262 - 2023</a></p>
	</section>
</main>