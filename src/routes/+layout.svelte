<script lang="ts">
	import '../app.css';
	import Icon from '@iconify/svelte';
	import PokemonCard from '$lib/components/PokemonCard.svelte';
	import type { LayoutData } from './$types';
	import { goto } from '$app/navigation';
	import { invalidate } from '$app/navigation';
	import { Input } from '$lib/components/ui/input';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';
	import { writable, derived } from 'svelte/store';

	export let data: LayoutData;

	let searchTerm = writable('');
	let selectedId: number | null = null;
	const { pokemons, types } = data;
	const selectedTypes = writable<Set<string>>(new Set());

	const toggleType = (typeName: string) => {
		selectedTypes.update((set) => {
			const updatedTypes = new Set(set);
			if (updatedTypes.has(typeName)) updatedTypes.delete(typeName);
			else updatedTypes.add(typeName);
			return updatedTypes;
		});
	};

	const filteredPokemons = derived([selectedTypes, searchTerm], ([$selectedTypes, $searchTerm]) => {
		let filtered = pokemons;

		// handle types filtering
		if ($selectedTypes.size > 0) {
			filtered = filtered.filter((p) => p.types.some((t) => $selectedTypes.has(t)));
		}

		// handle search 
		if ($searchTerm) {
			const term = $searchTerm.toLowerCase();
			filtered = filtered.filter(
				(p) =>
					p.name.toLowerCase().includes(term) || // by name
					p.types.some((t) => t.toLowerCase().includes(term)) || // by type
					p.id.toString().includes(term) // by id
			);
		}
		return filtered;
	});

	const selectPokemon = async (id: number) => {
		selectedId = id;
		await goto(`/pokemon/${id}`, { replaceState: false, noScroll: false });
		invalidate(`/pokemon/${id}`);
	};
</script>

<div class="flex min-h-screen min-w-screen bg-neutral-900 p-1 text-white lg:p-8">
	<div class="flex w-full flex-col-reverse rounded-2xl border border-neutral-700 lg:flex-row">
		<!-- section 1 -->
		<div
			class="sticky top-0 hidden h-screen items-center space-y-5 px-11 py-5 lg:flex lg:w-1/3 lg:flex-col"
		>
			<div class="flex w-83 gap-4 text-3xl font-semibold">
				<div class="aspect-square w-10">
					<img src="/pokemon.png" alt="pokemon icon" />
				</div>
				<p>Pokémon Explorer</p>
			</div>
			<button
				class="flex w-85 cursor-pointer items-center gap-4 rounded-xl bg-zinc-800 p-3 text-2xl"
			>
				<Icon icon="lucide:compass" class=" text-zinc-400" />
				<p>Explore</p>
			</button>
		</div>
		<!-- section 2 -->
		<div class="flex-col space-y-2 border-x border-stone-800 p-2 lg:w-1/3 lg:p-5">
			<!-- search bar -->
			<div class="sticky top-0 overflow-scroll bg-neutral-900 p-1 lg:p-5">
				<div class="flex h-fit w-full items-end gap-4">
					<div
						class=" flex h-fit flex-1 items-center rounded-xl bg-neutral-800 px-4 focus-within:border"
					>
						<Icon icon="mdi:magnify" class="h-5 w-5 text-zinc-400" />
						<Input
							placeholder="Search Pokémon..."
							bind:value={$searchTerm}
							class="flex border-none bg-transparent text-white placeholder-neutral-400 focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
						/>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger class="mt-2 rounded-md bg-neutral-800 px-4 py-2 text-sm">
							Filter by Type
						</DropdownMenuTrigger>
						<DropdownMenuContent class="bg-neutral-800 text-white">
							{#each types as type}
								<DropdownMenuItem>
									<button
										on:click={() => toggleType(type)}
										class="flex w-full items-center space-x-2"
									>
										<input
											type="checkbox"
											checked={$selectedTypes.has(type)}
											class="pointer-events-none accent-zinc-400"
											readonly
										/>
										<span class="capitalize">{type}</span>
									</button>
								</DropdownMenuItem>
							{/each}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<!-- pokemon list -->
			<div class="max-h-[calc(100vh-200px)] space-y-3 overflow-y-auto lg:pr-2">
				{#each $filteredPokemons as pokemon}
					<div
						class="{selectedId === pokemon.id
							? 'bg-neutral-700'
							: 'hover:bg-neutral-800'} rounded-xl"
					>
						<a
							href={`/pokemon/${pokemon.id}`}
							on:click|preventDefault={() => selectPokemon(pokemon.id)}
						>
							<PokemonCard {pokemon} />
						</a>
					</div>
				{/each}
			</div>
		</div>
		<!-- section 3 -->
		<div
			class="top-0 flex h-screen overflow-scroll border-x border-neutral-800 p-6 pb-44 lg:sticky lg:w-1/3"
		>
			<slot />
		</div>
	</div>
</div>
