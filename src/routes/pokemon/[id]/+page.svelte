<script lang="ts">
	import { page } from '$app/stores';
	import { writable } from 'svelte/store';

	const pokemon = writable<any>(null);
	const loading = writable(false);
	const error = writable(false);

	const fetchPokemon = async (id: string) => {
		try {
			const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
			if (!res.ok) throw new Error('Failed to fetch pokemon.');
			const data = await res.json();
			pokemon.set(data);
		} catch (err) {
			console.error(err);
			pokemon.set(null);
			error.set(true);
		} finally {
			loading.set(false);
		}
	};

	// re-fetch pokemon whenever the id changes
	$: id = $page.params.id;
	$: if (id) {
		loading.set(true);
		error.set(false);
		fetchPokemon(id);
	}
</script>

{#if $loading}
	<div class="flex h-full w-full items-center justify-center">
		<img src="/pokemon.png" alt="Loading" class="h-16 w-16 animate-spin" />
	</div>
{:else if $error}
	<div
		class="flex h-full w-full flex-col items-center justify-center gap-4 text-center text-rose-700"
	>
		<p>Failed to load Pokémon. Please try again.</p>
		<button
			class="rounded bg-white px-4 py-2 text-black hover:bg-neutral-200"
			on:click={() => fetchPokemon(id)}
		>
			Retry
		</button>
	</div>
{:else if $pokemon}
	<div class="side-panel w-full text-2xl">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3">
				<h2 class="font-semibold capitalize">{$pokemon.name}</h2>
				<h2 class="text-neutral-400">#{$pokemon.id}</h2>
			</div>
			<a href="/" class="cursor-pointer"> X </a>
		</div>
		<div class="my-5 flex h-fit w-full items-center justify-center">
			<img
				class="h-full w-60"
				src={$pokemon.sprites.other['official-artwork'].front_default}
				alt={$pokemon.name}
			/>
		</div>
        <!-- base stats -->
		<div>
			<div class=" mb-1 text-2xl">Base Stats</div>
			{#each $pokemon.stats as stat}
				<div class="mb-2 flex items-center gap-4 text-sm text-neutral-300 capitalize">
					<span class="w-30 font-medium">
						{stat.stat.name === 'hp' ? 'HP' : stat.stat.name}
					</span>
					<div class="h-1.5 flex-1 overflow-hidden rounded bg-neutral-700">
						<div class="h-full bg-sky-600" style="width: {Math.min(stat.base_stat, 100)}%"></div>
					</div>
					<span class="w-8 text-right font-semibold">{stat.base_stat}</span>
				</div>
			{/each}
		</div>
		<!-- abilities -->
		<div class="mt-3">
			<div class="text-2xl font-medium">Abilities:</div>
			<div class="pb-5">
				{#each $pokemon.abilities as ability}
					<div class="text-lg text-neutral-300 capitalize">{ability.ability.name}</div>
				{/each}
			</div>
		</div>
	</div>
{/if}
