<script lang="ts">
	import '../app.css';
	import { isDark } from '$lib/stores/theme';
	import PokemonList from '$lib/components/PokemonList.svelte';
	import { page
	 } from '$app/state';

	const selectedId = $derived(page.params.id ? parseInt(page.params.id) : null);

	$effect(() => {
		if (typeof document !== 'undefined') {
			document.documentElement.classList.toggle('dark', $isDark);
		}
	});
</script>

<PokemonList {selectedId} />

<div class="flex h-65 lg:h-full w-full lg:w-3/8 p-2 flex-col items-center justify-center gap-5 text-foreground ">
	<div class="w-30">
		<img src="/pokemonImg.png" alt="pokemon" />
	</div>
	<p class="text-center text-lg text-foreground">Select a Pokémon to view its details</p>
</div>
