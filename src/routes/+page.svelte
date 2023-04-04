<svelte:head>
	<title>The Ethics of Facial Recognition</title>
	<meta name="description" content="A website about the ethics of facial recognition">
	<meta name="keywords" content="facial recognition, ethics, privacy, surveillance">
	<meta name="author" content="Kameron Edmier">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
</svelte:head>

<script lang="ts">
	let lobbyID = '';
</script>

<main>
	<section class="flex flex-col my-32 gap-16 text-center">
		<h1 class="text-4xl font-serif">The Ethics of Facial Recognition</h1>
		<p class="text-lg font-sans">A short game about the ethics of facial recognition</p>

		<div>
			<input type="text" name="name" bind:value={lobbyID} placeholder="Lobby ID" >
			<a href="/play/{lobbyID || 'guest'}">Start</a>
		</div>
		
		<a href="/play/guest">No ID? Contine as Guest</a>

		<p class="text-sm font-sans">Made by <a href="https://kameron.edmier.com" target="_blank">Kameron Edmier for CSE 262 - 2023</a></p>
	</section>
</main>


<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
