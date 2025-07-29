<script lang="ts">
	import '../app.css';
	import Icon from '@iconify/svelte';
	import PokemonCard from '$lib/components/PokemonCard.svelte';
	import type { LayoutData } from './$types';
	import { goto } from '$app/navigation';
	import { invalidate } from '$app/navigation';
	import { Input } from '$lib/components/ui/input';
	import { isDark } from '$lib/stores/theme';
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
	let showMobileMenu = false;
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

	$: {
		if (typeof document !== 'undefined') {
			document.documentElement.classList.toggle('dark', $isDark);
		}
	}
</script>

<div
	class="flex min-h-screen min-w-screen bg-background p-1 text-foreground lg:p-8"
	class:dark={$isDark}
>
	<div class="flex w-full flex-col-reverse rounded-2xl border border-muted lg:flex-row">
		<!-- Section 1 -->
		<!-- Mobile Menu -->
		<div class=" order-1 flex items-center justify-between px-5 py-4 lg:hidden">
			<div class="flex items-center gap-3 text-xl font-semibold">
				<img src="/pokemon.png" alt="pokemon icon" class="h-8 w-8" />
				<p>Pokémon Explorer</p>
			</div>
			<button on:click={() => (showMobileMenu = !showMobileMenu)}>
				<Icon icon="lucide:menu" class="h-7 w-7" />
			</button>
		</div>
		{#if showMobileMenu}
			<div
				role="button"
				tabindex="0"
				class="fixed inset-0 z-50 bg-background/90 p-5 backdrop-blur-sm lg:hidden"
				on:click={() => (showMobileMenu = false)}
				on:keydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						showMobileMenu = false;
					}
				}}
			>
				<div class="flex flex-col space-y-4">
					<button class="flex items-center gap-3 rounded-xl bg-card p-3 text-xl">
						<Icon icon="lucide:compass" class="text-muted-foreground" />
						<p>Explore</p>
					</button>

					<button
						on:click={() => isDark.update((v) => !v)}
						class="flex items-center gap-3 rounded-xl bg-card p-3 text-xl"
					>
						<Icon icon={$isDark ? 'lucide:sun' : 'lucide:moon'} class="text-muted-foreground" />
						<p>{$isDark ? 'Light' : 'Dark'} Mode</p>
					</button>
				</div>
			</div>
		{/if}

		<div
			class="sticky top-0 hidden h-screen items-center space-y-5 px-11 py-5 lg:flex lg:w-1/3 lg:flex-col"
		>
			<div class="flex w-83 gap-4 text-3xl font-semibold">
				<div class="aspect-square w-10">
					<img src="/pokemon.png" alt="pokemon icon" />
				</div>
				<p>Pokémon Explorer</p>
			</div>
			<div class="flex flex-col space-y-3">
				<button class="flex w-85 cursor-pointer items-center gap-4 rounded-xl bg-card p-3 text-2xl">
					<Icon icon="lucide:compass" class="text-muted-foreground" />
					<p>Explore</p>
				</button>
				<button
					on:click={() => isDark.update((v) => !v)}
					class="flex w-85 cursor-pointer items-center gap-4 rounded-xl bg-card p-3 text-2xl"
				>
					<Icon icon="l{$isDark ? 'ucide:sun' : 'ucide:moon'}" class="text-muted-foreground" />

					<p>
						{$isDark ? 'Light' : 'Dark'} Mode
					</p>
				</button>
			</div>
		</div>

		<!-- Section 2 -->
		<div class="flex-col space-y-2 border-x border-muted p-2 lg:w-1/3 lg:p-5">
			<!-- Search Bar -->
			<div class="sticky top-0 overflow-scroll bg-background p-1 lg:p-5">
				<div class="flex h-fit w-full items-end gap-4">
					<div class="flex h-fit flex-1 items-center rounded-xl bg-card px-4 focus-within:border">
						<Icon icon="mdi:magnify" class="h-5 w-5 text-muted-foreground" />
						<Input
							placeholder="Search Pokémon..."
							bind:value={$searchTerm}
							class="flex border-none bg-transparent text-foreground placeholder-muted-foreground shadow-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
						/>
					</div>

					<!-- Type Filter -->
					<DropdownMenu>
						<DropdownMenuTrigger class="mt-2 rounded-md bg-card px-4 py-2 text-sm text-foreground">
							Filter by Type
						</DropdownMenuTrigger>
						<DropdownMenuContent class="bg-card text-foreground">
							{#each types as type}
								<DropdownMenuItem>
									<button
										on:click={() => toggleType(type)}
										class="flex w-full items-center space-x-2"
									>
										<input
											type="checkbox"
											checked={$selectedTypes.has(type)}
											class="pointer-events-none accent-muted-foreground"
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

			<!-- Pokémon List -->
			<div class="max-h-[calc(100vh-200px)] space-y-3 overflow-y-auto lg:pr-2">
				{#each $filteredPokemons as pokemon}
					<div class="{selectedId === pokemon.id ? 'bg-card' : 'hover:bg-muted'} rounded-xl">
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

		<!-- Section 3 -->
		<div
			class="top-0 flex h-screen overflow-scroll border-x border-muted p-6 pb-44 lg:sticky lg:w-1/3"
		>
			<slot />
		</div>
	</div>
</div>
