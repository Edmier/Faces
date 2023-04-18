<script lang="ts">
	import { page } from "$app/stores";
</script>

<main>
	<section class="flex flex-col my-32 gap-16 text-center justify-center items-center">
		<h1 class="text-4xl font-serif">Error {$page.status}</h1>
		<p class="text-lg font-sans">{$page.error?.message ?? 'An unknown error occured.'}</p>

		<a href="/" class="p-4 bg-gray-200 cursor-pointer max-w-lg rounded-md px-8 mx-8">Return Home</a>
	</section>
</main>