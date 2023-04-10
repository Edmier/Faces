<script lang="ts">
	import {display, type Face } from 'facesjs';
	import { onMount } from 'svelte';

	export let face: Face | null;

	// Random id
	const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	onMount(() => {
		if (!face) return;

		const canvas = document.getElementById(id);
		display(canvas, face, {});
	})
</script>

<div id={id}></div>