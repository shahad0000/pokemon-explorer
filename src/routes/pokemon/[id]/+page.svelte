<script lang="ts">
	import { page } from '$app/state';
	import PokemonList from '$lib/components/PokemonList.svelte';
	import type { PageData } from './$types';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import { navigating } from '$app/state';
	import Loading from '$lib/components/Loading.svelte';
	
	const { data }: { data: PageData } = $props();
	const selectedId = $derived(parseInt(page.params.id));

	const isNavigating = $derived(
		navigating?.to?.route?.id === '/pokemon/[id]' && navigating?.from?.route?.id === '/pokemon/[id]'
	);
</script>

<PokemonList {selectedId} />

<div class="w-full p-4 lg:w-3/8">
	{#if isNavigating}
		<div class="flex h-full items-center justify-center">
			<div class="text-center">
				<Loading />
				<p class="mt-4 text-muted-foreground">Loading Pokemon...</p>
			</div>
		</div>
	{:else if data.pokemon}
		<div class="side-panel w-full text-2xl">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<h2 class="font-semibold capitalize">{data.pokemon.name}</h2>
					<h2 class="text-neutral-400">#{data.pokemon.id}</h2>
				</div>
				<a href="/" class="cursor-pointer"> X </a>
			</div>
			<div class="my-5 flex h-fit w-full items-center justify-center">
				<img
					class="h-full w-60"
					src={data.pokemon.sprites.other['official-artwork'].front_default}
					alt={data.pokemon.name}
				/>
			</div>
			<!-- base stats -->
			<div>
				<div class=" mb-1 text-2xl">Base Stats</div>
				{#each data.pokemon.stats as stat}
					<ProgressBar name={stat.stat.name} value={stat.base_stat} />
				{/each}
			</div>
			<!-- abilities -->
			<div class="mt-3">
				<div class="text-2xl font-medium">Abilities:</div>
				<div class="pb-5">
					{#each data.pokemon.abilities as ability}
						<div class="text-lg text-muted-foreground capitalize">{ability.ability.name}</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>
