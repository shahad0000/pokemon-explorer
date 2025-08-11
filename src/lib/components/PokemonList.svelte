<script lang="ts">
	import PokemonCard from './PokemonCard.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import SearchInput from './SearchInput.svelte';
	import TypesFilter from './TypesFilter.svelte';
	import {
		store,
		initializeFromLayout,
		loadMorePokemon,
		searchPokemon,
		clearSearch as clearSearchStore
	} from '$lib/stores/pokemonStore.svelte';
	import { onMount } from 'svelte';
	import Loading from './Loading.svelte';

	const {
		selectedId = null
	}: {
		selectedId?: number | null;
	} = $props();

	let searchTerm = $state('');
	let selectedTypes = $state(new Set<string>());
	let searchTimeout: ReturnType<typeof setTimeout>;

	const pokemonData = $derived(store);

	onMount(async () => {
		initializeFromLayout(page.data);
	});

	$effect(() => {
		clearTimeout(searchTimeout);
		if (searchTerm.length === 0) {
			clearSearch();
		} else if (searchTerm.length >= 2) {
			searchTimeout = setTimeout(async () => {
				await searchPokemon(fetch, searchTerm);
			}, 300);
		}
	});

	const displayPokemons = $derived.by(() => {
		// Search mode
		if (pokemonData.isSearchMode) {
			let filtered = pokemonData.searchResults;

			if (selectedTypes.size > 0) {
				filtered = filtered.filter((p) =>
					p.types.some((typeObj) => selectedTypes.has(typeObj.type.name))
				);
			}

			return filtered;
		} else {
			// Normal browsing mode
			const { pokemons } = pokemonData;
			if (!pokemons || pokemons.length === 0) return [];

			let filtered = pokemons;

			// Type filter
			if (selectedTypes.size > 0) {
				filtered = filtered.filter((p) =>
					p.types.some((typeObj) => selectedTypes.has(typeObj.type.name))
				);
			}

			return filtered;
		}
	});

	const selectPokemon = async (id: number) => {
		await goto(`/pokemon/${id}`, { replaceState: false, noScroll: false });
	};

	const loadMore = async () => {
		await loadMorePokemon(fetch);
	};

	const clearSearch = () => {
		searchTerm = '';
		clearSearchStore();
	};
</script>

<div class="flex-col space-y-2 border-x border-muted p-2 py-1 lg:w-3/8 lg:px-2">
	<!-- Search and Filter -->
	<div class="sticky top-0 overflow-scroll bg-background p-1 lg:p-5">
		<div class="flex h-fit w-full items-end gap-4">
			<SearchInput bind:value={searchTerm} placeholder="Search all Pokemon..." />
			<TypesFilter types={pokemonData.types} bind:selectedTypes />
		</div>

		<!-- Search -->
		{#if pokemonData.isSearchMode}
			<div class="mt-2 flex items-center justify-between text-sm text-muted-foreground">
				<span>
					{pokemonData.searching
						? 'Searching...'
						: `Found ${pokemonData.searchResults.length} Pokemon`}
				</span>
				<button onclick={clearSearch} class="text-primary hover:underline"> Clear search </button>
			</div>
		{/if}
	</div>

	<!-- Loading -->
	{#if pokemonData.loading}
		<div class="flex items-center justify-center p-8">
			<Loading />
		</div>
	{/if}

	<!-- Error -->
	{#if pokemonData.error}
		<div class="flex items-center justify-center p-8">
			<div class="text-destructive">Error: {pokemonData.error}</div>
		</div>
	{/if}

	<!-- Pokémon List -->
	{#if !pokemonData.loading && !pokemonData.error}
		<div class="max-h-[calc(100vh-100px)] space-y-3 overflow-y-auto lg:px-5">
			<!-- Search Loading -->
			{#if pokemonData.searching}
				<div class="flex items-center justify-center p-4">
					<Loading />
				</div>
			{/if}

			{#each displayPokemons as pokemon}
				<div class="{selectedId === pokemon.id ? 'bg-card' : 'hover:bg-muted'} rounded-xl">
					<a
						href={`/pokemon/${pokemon.id}`}
						onclick={(e) => {
							e.preventDefault();
							selectPokemon(pokemon.id);
						}}
					>
						<PokemonCard {pokemon} />
					</a>
				</div>
			{/each}

			<!-- No results -->
			{#if pokemonData.isSearchMode && !pokemonData.searching && displayPokemons.length === 0}
				<div class="flex items-center justify-center p-8 text-muted-foreground">
					No Pokemon found for "{searchTerm}"
				</div>
			{/if}

			<!-- Load More Button -->
			{#if !pokemonData.isSearchMode && pokemonData.pagination?.hasMore && selectedTypes.size === 0}
				{#if pokemonData.loadingMore}
					<div class="flex justify-center py-4">
						<Loading />
					</div>
				{:else}
					<div class="flex justify-center py-4">
						<button
							onclick={loadMore}
							disabled={pokemonData.loadingMore}
							class="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
						>
							Load More
						</button>
					</div>
				{/if}
			{/if}
		</div>
	{/if}
</div>
