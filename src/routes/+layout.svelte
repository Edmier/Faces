<script lang="ts">
	import Footer from "$components/footer.svelte";
</script>

<div class="flex flex-col min-h-screen">
	<div class="flex-grow">
		<slot />
	</div>
	<div class="min-h-5 text-center m-4">
		<Footer />
	</div>
</div>


<style lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>