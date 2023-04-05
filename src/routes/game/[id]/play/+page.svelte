<script lang="ts">
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<pre>{JSON.stringify(data.user, undefined, 4)}</pre>