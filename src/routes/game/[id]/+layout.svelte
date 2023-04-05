<script lang="ts">
	import Header from "$components/header.svelte";
	import type { LayoutData } from "./$types";

	export let data: LayoutData;
</script>


<Header lobbyName={data.lobby?.name ?? ''} />

<slot />